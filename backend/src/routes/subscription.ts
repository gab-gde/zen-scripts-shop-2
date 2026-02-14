import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import { requireUser } from '../middleware/user-auth';

const router = Router();

router.use(requireUser);

// ══════════════════════════════════════════════════════════════════════
// GET /api/subscription/status
// ══════════════════════════════════════════════════════════════════════
router.get('/status', async (req: Request, res: Response) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('is_subscribed, subscription_tier, subscription_expires_at, stripe_subscription_id')
      .eq('id', req.user!.userId)
      .single();

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let stripeStatus = null;
    if (user.stripe_subscription_id) {
      try {
        const sub = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
        stripeStatus = {
          status: sub.status,
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        };
      } catch (e) {
        // Subscription might not exist anymore
      }
    }

    return res.json({
      success: true,
      subscription: {
        isActive: user.is_subscribed,
        tier: user.subscription_tier,
        expiresAt: user.subscription_expires_at,
        stripe: stripeStatus,
      },
    });
  } catch (error) {
    console.error('[Subscription] Status error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/subscription/create - Create Stripe Checkout for subscription
// ══════════════════════════════════════════════════════════════════════
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { tier } = req.body; // 'pro' or 'elite'

    if (!tier || !['pro', 'elite'].includes(tier)) {
      return res.status(400).json({ success: false, error: 'Invalid subscription tier' });
    }

    const priceId = tier === 'pro' ? config.subscription.proPriceId : config.subscription.elitePriceId;

    if (!priceId) {
      return res.status(400).json({ success: false, error: 'Subscription not configured yet' });
    }

    // Get or create Stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id, email, username')
      .eq('id', req.user!.userId)
      .single();

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: req.user!.userId,
          username: user.username,
        },
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', req.user!.userId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        user_id: req.user!.userId,
        tier,
      },
      success_url: `${config.siteUrl}/dashboard/subscription?success=true`,
      cancel_url: `${config.siteUrl}/dashboard/subscription?cancelled=true`,
    });

    return res.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('[Subscription] Create error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/subscription/cancel
// ══════════════════════════════════════════════════════════════════════
router.post('/cancel', async (req: Request, res: Response) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', req.user!.userId)
      .single();

    if (!user?.stripe_subscription_id) {
      return res.status(400).json({ success: false, error: 'No active subscription' });
    }

    // Cancel at period end (don't revoke immediately)
    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Log event
    await supabase.from('subscription_events').insert({
      user_id: req.user!.userId,
      event_type: 'cancelled',
      tier: 'current',
    });

    return res.json({ success: true, message: 'Abonnement annulé à la fin de la période' });
  } catch (error) {
    console.error('[Subscription] Cancel error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/subscription/reactivate
// ══════════════════════════════════════════════════════════════════════
router.post('/reactivate', async (req: Request, res: Response) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', req.user!.userId)
      .single();

    if (!user?.stripe_subscription_id) {
      return res.status(400).json({ success: false, error: 'No subscription to reactivate' });
    }

    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    return res.json({ success: true, message: 'Abonnement réactivé' });
  } catch (error) {
    console.error('[Subscription] Reactivate error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
