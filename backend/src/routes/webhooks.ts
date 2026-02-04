import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../services/email';
import Stripe from 'stripe';

const router = Router();

// Generate order number: ZEN-YYYYMMDD-XXXX
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
// IMPORTANT: This route receives raw body for signature verification
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    console.error('[WEBHOOK] No Stripe signature header');
    return res.status(400).json({ error: 'No signature header' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature using raw body
    // req.body is a Buffer because of express.raw() middleware
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret
    );
  } catch (err: any) {
    console.error('[WEBHOOK] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`[WEBHOOK] Received event: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log(`[WEBHOOK] Processing checkout.session.completed: ${session.id}`);

      try {
        // Extract data from session
        const email = session.customer_details?.email;
        const scriptId = session.metadata?.scriptId;
        const scriptName = session.metadata?.scriptName || 'Script';
        const amountTotal = session.amount_total || 0;
        const currency = session.currency || 'eur';

        if (!email || !scriptId) {
          console.error('[WEBHOOK] Missing email or scriptId in session metadata');
          break;
        }

        // Check if order already exists (idempotency)
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_session_id', session.id)
          .single();

        if (existingOrder) {
          console.log(`[WEBHOOK] Order already exists for session: ${session.id}`);
          break;
        }

        // Generate unique order number
        const orderNumber = generateOrderNumber();

        // Create order in database
        const { error: insertError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            email: email,
            script_id: scriptId,
            amount_cents: amountTotal,
            currency: currency.toUpperCase(),
            stripe_session_id: session.id,
            payment_status: 'completed',
          });

        if (insertError) {
          console.error('[WEBHOOK] Failed to insert order:', insertError);
          throw insertError;
        }

        console.log(`[WEBHOOK] Order created: ${orderNumber}`);

        // Format amount for email
        const formattedAmount = `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}`;

        // Send confirmation email to customer
        await sendOrderConfirmationEmail({
          to: email,
          orderNumber,
          scriptName,
          amount: formattedAmount,
        });

        // Send notification to admin
        await sendAdminNotificationEmail({
          to: email,
          orderNumber,
          scriptName,
          amount: formattedAmount,
        });

        console.log(`[WEBHOOK] Emails sent for order: ${orderNumber}`);

      } catch (error) {
        console.error('[WEBHOOK] Error processing checkout.session.completed:', error);
        // Don't return error to Stripe - we've received the webhook
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[WEBHOOK] Checkout session expired: ${session.id}`);
      break;
    }

    default:
      console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  res.json({ received: true });
});

export default router;
