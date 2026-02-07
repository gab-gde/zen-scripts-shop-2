import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';

const router = Router();

const createSessionSchema = z.object({
  scriptId: z.string().uuid('Invalid script ID'),
  email: z.string().email('Invalid email').optional(),
});

// POST /api/checkout/create-session
router.post('/create-session', async (req: Request, res: Response) => {
  try {
    const validation = createSessionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation error', details: validation.error.errors });
    }

    const { scriptId, email } = validation.data;

    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', scriptId)
      .eq('is_active', true)
      .single();

    if (scriptError || !script) {
      return res.status(404).json({ success: false, error: 'Script not found or not available' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,

      // ← NOUVEAU: Demande le pseudo/gamertag pendant le checkout
      custom_fields: [
        {
          key: 'pseudo',
          label: { type: 'custom', custom: 'Votre pseudo / gamertag' },
          type: 'text',
          optional: false,
        },
      ],

      line_items: [
        {
          price_data: {
            currency: script.currency.toLowerCase(),
            product_data: {
              name: script.name,
              description: script.short_description,
              images: script.images?.length > 0 && script.images[0].startsWith('http')
                ? [script.images[0]] 
                : [],
            },
            unit_amount: script.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        script_id: script.id,
        script_name: script.name,
        script_slug: script.slug,
      },
      success_url: `${config.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.siteUrl}/cancel`,
    });

    return res.json({ url: session.url });
  } catch (error: any) {
    console.error('[Checkout] Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/checkout/session/:sessionId
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const { data: order } = await supabase
      .from('orders')
      .select('*, scripts(name, slug)')
      .eq('stripe_session_id', sessionId)
      .single();

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({ order });
  } catch (error) {
    console.error('[Checkout] Session error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
