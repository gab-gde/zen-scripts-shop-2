import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';

const router = Router();

// ── Tiers pricing (in cents) ──
const TIERS: Record<string, { name: string; price: number; label: string }> = {
  standard: { name: 'NEXUS Standard', price: 50, label: 'Standard' },
  pro:      { name: 'NEXUS Pro',      price: 100, label: 'Pro' },
  lifetime: { name: 'NEXUS Lifetime', price: 200, label: 'Lifetime' },
};

// POST /api/nexus/checkout
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { tier } = req.body;
    const selected = TIERS[tier || 'standard'];

    if (!selected) {
      return res.status(400).json({ success: false, error: 'Invalid tier' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: selected.name,
              description: `NEXUS v4.2.1 — Warzone Cheat Suite (${selected.label})`,
            },
            unit_amount: selected.price,
          },
          quantity: 1,
        },
      ],
      custom_fields: [
        {
          key: 'pseudo',
          label: { type: 'custom', custom: 'Votre pseudo / gamertag' },
          type: 'text',
          optional: false,
        },
      ],
      metadata: {
        product: 'nexus',
        version: '4.2.1',
        tier: selected.label,
      },
      success_url: `${config.siteUrl}/nexus/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.siteUrl}/nexus`,
    });

    return res.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('[NEXUS Checkout] Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/nexus/download/:sessionId
router.get('/download/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.status !== 'complete') {
      return res.status(400).json({ success: false, error: 'Session not valid' });
    }

    const pseudo = session.custom_fields?.find((f: any) => f.key === 'pseudo')?.text?.value || '';
    const email = session.customer_details?.email || '';
    const tier = session.metadata?.tier || 'Standard';

    await supabase.from('nexus_downloads').upsert(
      {
        stripe_session_id: session.id,
        email,
        pseudo,
        tier,
        downloaded_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_session_id' }
    );

    return res.json({
      success: true,
      email,
      pseudo,
      tier,
      exe_url: 'https://github.com/gab-gde/zen-scripts-shop-2/releases/download/nexus-v4.2.1/NEXUS.exe',
      pdf_url: '/downloads/NEXUS_Documentation.pdf',
    });
  } catch (error: any) {
    console.error('[NEXUS Download] Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/nexus/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { count } = await supabase
      .from('nexus_downloads')
      .select('*', { count: 'exact', head: true });

    return res.json({ success: true, total_downloads: count || 0 });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
