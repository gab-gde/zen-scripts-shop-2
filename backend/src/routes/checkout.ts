import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import { optionalUser } from '../middleware/user-auth';
import { validateRewardCode } from '../services/points';

const router = Router();

const createSessionSchema = z.object({
  scriptId: z.string().uuid('Invalid script ID'),
  email: z.string().email('Invalid email').optional(),
  discountCode: z.string().optional(),
});

// POST /api/checkout/create-session
router.post('/create-session', optionalUser, async (req: Request, res: Response) => {
  try {
    const validation = createSessionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation error', details: validation.error.errors });
    }

    const { scriptId, email, discountCode } = validation.data;

    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', scriptId)
      .eq('is_active', true)
      .single();

    if (scriptError || !script) {
      return res.status(404).json({ success: false, error: 'Script not found or not available' });
    }

    let finalAmount = script.price_cents;
    let rewardCodeId: string | null = null;

    // Validate discount code if provided
    if (discountCode) {
      const codeResult = await validateRewardCode(discountCode);
      if (codeResult.valid && codeResult.discount_percent) {
        finalAmount = Math.round(script.price_cents * (1 - codeResult.discount_percent / 100));
        rewardCodeId = codeResult.code_id || null;
      }
    }

    // Determine customer email
    let customerEmail = email;
    if (req.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', req.user.userId)
        .single();
      if (userData) customerEmail = userData.email;
    }

    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
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
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        script_id: script.id,
        script_name: script.name,
        script_slug: script.slug,
        user_id: req.user?.userId || '',
        reward_code_id: rewardCodeId || '',
        original_price: script.price_cents.toString(),
        discount_applied: discountCode || '',
      },
      success_url: `${config.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.siteUrl}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.json({
      url: session.url,
      originalPrice: script.price_cents,
      finalPrice: finalAmount,
      discountApplied: finalAmount < script.price_cents,
    });
  } catch (error: any) {
    console.error('[Checkout] Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/checkout/validate-code
router.post('/validate-code', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Code required' });
    }

    const result = await validateRewardCode(code);

    return res.json({
      success: true,
      valid: result.valid,
      discount_percent: result.discount_percent || 0,
    });
  } catch (error) {
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
