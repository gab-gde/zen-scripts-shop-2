import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../services/email';
import Stripe from 'stripe';

const router = Router();

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZEN-${datePart}-${randomPart}`;
}

// POST /api/webhooks/stripe
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    console.error('[WEBHOOK] No signature');
    return res.status(400).json({ error: 'No signature' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err: any) {
    console.error('[WEBHOOK] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`[WEBHOOK] Event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      const email = session.customer_details?.email;
      const scriptId = session.metadata?.scriptId;
      const scriptName = session.metadata?.scriptName || 'Script';
      const amountTotal = session.amount_total || 0;
      const currency = session.currency || 'eur';

      if (!email || !scriptId) {
        console.error('[WEBHOOK] Missing email or scriptId');
        return res.json({ received: true });
      }

      // Check idempotency
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single();

      if (existingOrder) {
        console.log('[WEBHOOK] Order already exists');
        return res.json({ received: true });
      }

      const orderNumber = generateOrderNumber();

      const { error: insertError } = await supabase.from('orders').insert({
        order_number: orderNumber,
        email: email,
        script_id: scriptId,
        amount_cents: amountTotal,
        currency: currency.toUpperCase(),
        stripe_session_id: session.id,
        payment_status: 'completed',
      });

      if (insertError) {
        console.error('[WEBHOOK] Insert error:', insertError);
      } else {
        console.log(`[WEBHOOK] Order created: ${orderNumber}`);

        const formattedAmount = `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}`;

        await sendOrderConfirmationEmail({ to: email, orderNumber, scriptName, amount: formattedAmount });
        await sendAdminNotificationEmail({ to: email, orderNumber, scriptName, amount: formattedAmount });
      }
    } catch (error) {
      console.error('[WEBHOOK] Processing error:', error);
    }
  }

  res.json({ received: true });
});

export default router;
