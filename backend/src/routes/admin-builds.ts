import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { generateLicense } from '../services/license-generator';
import { getBaseScript, storeBuild, regenerateDownloadUrl } from '../services/storage';
import { sendOrderConfirmationWithBuild } from '../services/email';

const router = Router();

// ══════════════════════════════════════════════════════════════════════
// GET /api/admin/builds - Lister tous les builds
// ══════════════════════════════════════════════════════════════════════
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data: builds, error } = await supabase
      .from('builds')
      .select('*, orders(order_number, email, amount_cents, currency)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return res.json({ builds: builds || [] });
  } catch (error: any) {
    console.error('[Admin/Builds] Erreur liste:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/admin/builds/:id/regenerate-link - Regénérer lien téléchargement
// ══════════════════════════════════════════════════════════════════════
router.post('/:id/regenerate-link', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { expires_hours = 24 } = req.body;

    const { data: build, error } = await supabase
      .from('builds')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !build) {
      return res.status(404).json({ error: 'Build not found' });
    }

    const expiresIn = Math.min(expires_hours, 168) * 3600; // Max 7 jours
    const downloadUrl = await regenerateDownloadUrl(build.storage_path, expiresIn);

    if (!downloadUrl) {
      return res.status(500).json({ error: 'Failed to regenerate URL' });
    }

    return res.json({ 
      downloadUrl, 
      expiresIn: `${expires_hours}h`,
      filename: build.filename,
    });
  } catch (error: any) {
    console.error('[Admin/Builds] Erreur regénération:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/admin/builds/:id/resend-email - Renvoyer l'email au client
// ══════════════════════════════════════════════════════════════════════
router.post('/:id/resend-email', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: build, error } = await supabase
      .from('builds')
      .select('*, orders(order_number, amount_cents, currency)')
      .eq('id', id)
      .single();

    if (error || !build) {
      return res.status(404).json({ error: 'Build not found' });
    }

    // Regénérer un lien frais (24h)
    const downloadUrl = await regenerateDownloadUrl(build.storage_path, 86400);

    if (!downloadUrl) {
      return res.status(500).json({ error: 'Failed to regenerate URL' });
    }

    const amount = build.orders
      ? `${(build.orders.amount_cents / 100).toFixed(2)} ${build.orders.currency === 'EUR' ? '€' : build.orders.currency}`
      : '';

    await sendOrderConfirmationWithBuild(
      build.buyer_email,
      build.orders?.order_number || '-',
      build.script_name || 'Script',
      amount,
      build.buyer_pseudo,
      build.license_key,
      downloadUrl,
      build.filename
    );

    return res.json({ success: true, message: `Email renvoyé à ${build.buyer_email}` });
  } catch (error: any) {
    console.error('[Admin/Builds] Erreur renvoi email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/admin/builds/manual-generate - Générer un build manuellement
// ══════════════════════════════════════════════════════════════════════
router.post('/manual-generate', async (req: Request, res: Response) => {
  try {
    const { order_id, script_slug, pseudo, email } = req.body;

    if (!script_slug || !pseudo || !email) {
      return res.status(400).json({ error: 'script_slug, pseudo, and email are required' });
    }

    // Récupérer le script de base
    const baseCode = await getBaseScript(script_slug);
    if (!baseCode) {
      return res.status(404).json({ error: `Pas de script de base trouvé pour "${script_slug}". Uploadez le .gpc dans le bucket "base-scripts".` });
    }

    // Récupérer l'ID du script
    const { data: scriptData } = await supabase
      .from('scripts')
      .select('id, name')
      .eq('slug', script_slug)
      .single();

    // Générer le build
    const result = generateLicense(baseCode, pseudo, email, script_slug);

    // Stocker
    const storagePath = await storeBuild(
      result.filename,
      result.protectedCode,
      order_id || `manual-${Date.now()}`
    );

    if (!storagePath) {
      return res.status(500).json({ error: 'Erreur stockage du build' });
    }

    // Lien de téléchargement
    const downloadUrl = await regenerateDownloadUrl(storagePath, 86400);

    // Enregistrer en DB
    await supabase.from('builds').insert({
      order_id: order_id || null,
      script_id: scriptData?.id || null,
      buyer_pseudo: pseudo,
      buyer_email: email,
      license_key: result.licenseKey,
      watermark: result.watermark,
      filename: result.filename,
      storage_path: storagePath,
      script_name: result.scriptName,
    });

    return res.json({
      success: true,
      filename: result.filename,
      licenseKey: result.licenseKey,
      downloadUrl,
      watermark: result.watermark,
    });
  } catch (error: any) {
    console.error('[Admin/Builds] Erreur génération manuelle:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// DELETE /api/admin/builds/:id - Révoquer un build
// ══════════════════════════════════════════════════════════════════════
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('builds')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    return res.json({ success: true, message: 'Build révoqué' });
  } catch (error: any) {
    console.error('[Admin/Builds] Erreur révocation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
