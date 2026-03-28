import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';

const router = Router();

// POST /api/nexus/checkout
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_collection: 'if_required',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'NEXUS v4.2.1 — Warzone Cheat Suite',
              description: 'External cheat suite pour COD: Warzone. Gratuit pour les clients Zeus Prenium.',
            },
            unit_amount: 0,
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

// GET /api/nexus/download/:sessionId — verify session then return download info
router.get('/download/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.status !== 'complete') {
      return res.status(400).json({ success: false, error: 'Session not valid' });
    }

    // Log download in Supabase
    const pseudo = session.custom_fields?.find((f: any) => f.key === 'pseudo')?.text?.value || '';
    const email = session.customer_details?.email || '';

    // Upsert to avoid duplicates
    await supabase.from('nexus_downloads').upsert(
      {
        stripe_session_id: session.id,
        email,
        pseudo,
        downloaded_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_session_id' }
    );

    return res.json({
      success: true,
      email,
      pseudo,
      exe_url: 'https://github.com/gab-gde/zen-scripts-shop-2/releases/download/nexus-v4.2.1/NEXUS.exe',
      pdf_url: '/downloads/NEXUS_Documentation.pdf',
    });
  } catch (error: any) {
    console.error('[NEXUS Download] Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/nexus/stats — admin: count downloads
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
