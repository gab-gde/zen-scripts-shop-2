import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { stripe } from '../lib/stripe';
import { supabase, Script } from '../lib/supabase';
import { config } from '../lib/config';

const router = Router();

// Validation schema
const createSessionSchema = z.object({
  scriptId: z.string().uuid('Invalid script ID'),
  email: z.string().email('Invalid email').optional(),
});

// POST /api/checkout/create-session
router.post('/create-session', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = createSessionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validation.error.errors,
      });
    }

    const { scriptId, email } = validation.data;

    // Fetch script from database
    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', scriptId)
      .eq('is_active', true)
      .single();

    if (scriptError || !script) {
      return res.status(404).json({
        success: false,
        error: 'Script not found or not available',
      });
    }

    const typedScript = script as Script;

    // Create Stripe Checkout Session with inline price_data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: typedScript.currency.toLowerCase(),
            product_data: {
              name: typedScript.name,
              description: typedScript.short_description,
              images: typedScript.images.length > 0 ? [typedScript.images[0]] : undefined,
            },
            unit_amount: typedScript.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        scriptId: typedScript.id,
        scriptName: typedScript.name,
      },
      success_url: `${config.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.siteUrl}/cancel`,
    });

    console.log(`[CHECKOUT] Session created: ${session.id} for script ${typedScript.name}`);

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error('[CHECKOUT] Session creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
    });
  }
});

// GET /api/checkout/session/:sessionId - Get session details for success page
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Fetch order from database by stripe_session_id
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        scripts (name)
      `)
      .eq('stripe_session_id', sessionId)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      order: {
        orderNumber: order.order_number,
        scriptName: (order as any).scripts?.name || 'Script',
        amount: `${(order.amount_cents / 100).toFixed(2)} ${order.currency.toUpperCase()}`,
        email: order.email,
      },
    });
  } catch (error) {
    console.error('[CHECKOUT] Get session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session details',
    });
  }
});

export default router;
