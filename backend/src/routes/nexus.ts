import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@scriptszeus.eu';
const SITE_URL = process.env.FRONTEND_URL || 'https://scriptszeus.eu';

const router = Router();

// ── Tiers pricing (in cents) ──
const TIERS: Record<string, { name: string; price: number; label: string }> = {
  standard: { name: 'NEXUS Standard', price: 125, label: 'Standard' },
  pro:      { name: 'NEXUS Pro',      price: 175, label: 'Pro' },
  lifetime: { name: 'NEXUS Lifetime', price: 225, label: 'Lifetime' },
};

// ── Send NEXUS license email ──
async function sendNexusLicenseEmail(
  email: string,
  pseudo: string,
  tier: string,
  licenseKey: string
) {
  const tierColors: Record<string, string> = {
    Lifetime: '#ff3e3e',
    Pro: '#ff9900',
    Standard: '#00ccff',
  };
  const color = tierColors[tier] || '#ff3e3e';

  try {
    await resend.emails.send({
      from: `Scripts Zeus <${FROM_EMAIL}>`,
      to: email,
      subject: `🔑 NEXUS ${tier} — Votre clé de licence`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; background: #0a0a12; color: #fff; font-family: -apple-system, sans-serif; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1a0a0a 0%, #0a0a12 100%); padding: 35px 30px; text-align: center; border-bottom: 2px solid ${color};">
            <h1 style="color: ${color}; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 4px;">NEXUS</h1>
            <p style="color: #555; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px;">v4.2.1 — WARZONE CHEAT SUITE</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #fff; margin: 0 0 5px 0; font-size: 18px;">Merci ${pseudo} !</h2>
            <p style="color: #888; font-size: 14px; margin: 0 0 25px 0;">Votre licence <strong style="color: ${color};">${tier}</strong> est prête.</p>

            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #111 100%); border: 2px solid ${color}; border-radius: 12px; padding: 25px; margin-bottom: 25px; text-align: center;">
              <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">Votre clé de licence</p>
              <div style="background: #0a0a0a; border-radius: 8px; padding: 15px; border: 1px solid #333;">
                <code style="color: ${color}; font-size: 22px; font-weight: bold; letter-spacing: 3px; font-family: 'Courier New', monospace;">${licenseKey}</code>
              </div>
              <p style="color: #555; font-size: 11px; margin: 12px 0 0 0;">Copiez cette clé et collez-la au lancement de NEXUS</p>
            </div>

            <div style="background: #16161f; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
              <h3 style="color: #fff; margin: 0 0 15px 0; font-size: 15px;">Activation en 3 étapes</h3>
              <div style="margin-bottom: 12px;">
                <span style="background: ${color}; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; font-size: 11px;">1</span>
                <span style="color: #d1d5db; margin-left: 10px; font-size: 14px;">Lancez <strong>NEXUS.exe</strong></span>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="background: ${color}; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; font-size: 11px;">2</span>
                <span style="color: #d1d5db; margin-left: 10px; font-size: 14px;">Collez la clé ci-dessus dans le champ de licence</span>
              </div>
              <div>
                <span style="background: ${color}; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; font-size: 11px;">3</span>
                <span style="color: #d1d5db; margin-left: 10px; font-size: 14px;">Cliquez <strong>ACTIVATE</strong> — c'est prêt !</span>
              </div>
            </div>

            <div style="background: #111; border-radius: 8px; padding: 15px; margin-bottom: 25px; border-left: 3px solid ${color};">
              <p style="color: ${color}; font-weight: bold; margin: 0 0 5px 0; font-size: 13px;">Licence ${tier}</p>
              <p style="color: #888; margin: 0; font-size: 12px;">
                ${tier === 'Lifetime' ? 'Accès complet permanent à toutes les features. Mises à jour à vie. Support VIP.' :
                  tier === 'Pro' ? 'Accès complet : Aimbot, ESP, Chams, Radar, World ESP. Support prioritaire.' :
                  'Aimbot basique, ESP Boxes, No Recoil, HUD Overlays.'}
              </p>
            </div>

            <div style="background: #16161f; border-radius: 8px; padding: 12px 15px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                <strong style="color: #888;">Raccourcis :</strong> INSERT = toggle menu · ESC = quitter
              </p>
            </div>

            <p style="color: #555; font-size: 12px; text-align: center;">
              Besoin d'aide ? <a href="${SITE_URL}/support" style="color: #facc15;">Contactez le support</a>
            </p>
          </div>
          
          <div style="background: #0d0d14; padding: 15px; text-align: center; border-top: 1px solid #1a1a2a;">
            <p style="color: #333; font-size: 10px; margin: 0;">
              NEXUS © 2026 — Scripts Zeus · Ne partagez jamais votre clé de licence
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[NEXUS Email] License sent to ${email} (${tier})`);
  } catch (error) {
    console.error('[NEXUS Email] Error:', error);
  }
}

// ── POST /api/nexus/checkout ──
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

// ── GET /api/nexus/download/:sessionId ──
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

    // Check if already processed (avoid double key assignment)
    const { data: existing } = await supabase
      .from('nexus_downloads')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (existing) {
      return res.json({
        success: true,
        email,
        pseudo,
        tier,
        license_key: existing.license_key,
        exe_url: 'https://github.com/gab-gde/zen-scripts-shop-2/releases/download/nexus-v4.2.1/NEXUS.exe',
        pdf_url: '/downloads/NEXUS_Documentation.pdf',
      });
    }

    // Find available key for this tier
    const { data: availableKey, error: keyError } = await supabase
      .from('nexus_keys')
      .select('*')
      .eq('tier', tier)
      .eq('used', false)
      .limit(1)
      .single();

    let assignedKey = 'CONTACT-SUPPORT';

    if (availableKey && !keyError) {
      assignedKey = availableKey.key;

      // Mark key as used
      await supabase
        .from('nexus_keys')
        .update({ used: true, used_by: email, used_at: new Date().toISOString() })
        .eq('id', availableKey.id);
    } else {
      console.warn(`[NEXUS] No available key for tier ${tier}!`);
    }

    // Save download record
    await supabase.from('nexus_downloads').insert({
      stripe_session_id: session.id,
      email,
      pseudo,
      tier,
      license_key: assignedKey,
      downloaded_at: new Date().toISOString(),
    });

    // Send license email
    if (email && assignedKey !== 'CONTACT-SUPPORT') {
      await sendNexusLicenseEmail(email, pseudo, tier, assignedKey);
    }

    return res.json({
      success: true,
      email,
      pseudo,
      tier,
      license_key: assignedKey,
      exe_url: 'https://github.com/gab-gde/zen-scripts-shop-2/releases/download/nexus-v4.2.1/NEXUS.exe',
      pdf_url: '/downloads/NEXUS_Documentation.pdf',
    });
  } catch (error: any) {
    console.error('[NEXUS Download] Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ── GET /api/nexus/stats ──
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { count } = await supabase
      .from('nexus_downloads')
      .select('*', { count: 'exact', head: true });

    const { data: keysLeft } = await supabase
      .from('nexus_keys')
      .select('tier')
      .eq('used', false);

    return res.json({
      success: true,
      total_downloads: count || 0,
      keys_remaining: {
        total: keysLeft?.length || 0,
        standard: keysLeft?.filter((k: any) => k.tier === 'Standard').length || 0,
        pro: keysLeft?.filter((k: any) => k.tier === 'Pro').length || 0,
        lifetime: keysLeft?.filter((k: any) => k.tier === 'Lifetime').length || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
