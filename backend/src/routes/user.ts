import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireUser } from '../middleware/user-auth';
import { generateLicense } from '../services/license-generator';
import { getBaseScript, storeBuild, getDownloadUrl } from '../services/storage';

const router = Router();

// All routes require authentication
router.use(requireUser);

// ══════════════════════════════════════════════════════════════════════
// GET /api/user/dashboard - Overview stats
// ══════════════════════════════════════════════════════════════════════
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [userResult, scriptsResult, ordersResult, notifsResult] = await Promise.all([
      supabase.from('users')
        .select('id, email, username, avatar_url, points_balance, is_subscribed, subscription_tier, subscription_expires_at, created_at')
        .eq('id', userId).single(),
      supabase.from('user_scripts')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      supabase.from('orders')
        .select('id, amount_cents', { count: 'exact' })
        .eq('user_id', userId),
      supabase.from('update_notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_read', false),
    ]);

    const totalSpent = ordersResult.data?.reduce((sum, o) => sum + (o.amount_cents || 0), 0) || 0;

    return res.json({
      success: true,
      user: userResult.data,
      stats: {
        totalScripts: scriptsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalSpent: totalSpent / 100,
        unreadNotifications: notifsResult.count || 0,
      },
    });
  } catch (error) {
    console.error('[User] Dashboard error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/user/scripts - User's script library
// ══════════════════════════════════════════════════════════════════════
router.get('/scripts', async (req: Request, res: Response) => {
  try {
    const { data: scripts, error } = await supabase
      .from('user_scripts')
      .select('*, scripts(id, name, slug, short_description, images, price_cents, currency)')
      .eq('user_id', req.user!.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, scripts: scripts || [] });
  } catch (error) {
    console.error('[User] Scripts error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/user/orders - User's order history
// ══════════════════════════════════════════════════════════════════════
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, scripts(name, slug, images)')
      .eq('user_id', req.user!.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, orders: orders || [] });
  } catch (error) {
    console.error('[User] Orders error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/user/points - Points history & available rewards
// ══════════════════════════════════════════════════════════════════════
router.get('/points', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [balanceResult, txResult, tiersResult, codesResult] = await Promise.all([
      supabase.from('users').select('points_balance').eq('id', userId).single(),
      supabase.from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('reward_tiers')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true }),
      supabase.from('reward_codes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    return res.json({
      success: true,
      balance: balanceResult.data?.points_balance || 0,
      transactions: txResult.data || [],
      tiers: tiersResult.data || [],
      codes: codesResult.data || [],
    });
  } catch (error) {
    console.error('[User] Points error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/user/points/redeem - Redeem points for a discount code
// ══════════════════════════════════════════════════════════════════════
router.post('/points/redeem', async (req: Request, res: Response) => {
  try {
    const { tierId } = req.body;
    if (!tierId) {
      return res.status(400).json({ success: false, error: 'tierId is required' });
    }

    const { generateRewardCode } = await import('../services/points');
    const result = await generateRewardCode(req.user!.userId, tierId);

    if (!result) {
      return res.status(400).json({ success: false, error: 'Points insuffisants ou palier invalide' });
    }

    return res.json({
      success: true,
      code: result.code,
      discount_percent: result.discount_percent,
    });
  } catch (error) {
    console.error('[User] Redeem error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/user/notifications - Update notifications
// ══════════════════════════════════════════════════════════════════════
router.get('/notifications', async (req: Request, res: Response) => {
  try {
    const { data: notifications, error } = await supabase
      .from('update_notifications')
      .select('*, script_updates(*, scripts(name, slug))')
      .eq('user_id', req.user!.userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    return res.json({ success: true, notifications: notifications || [] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// PUT /api/user/notifications/:id/read
// ══════════════════════════════════════════════════════════════════════
router.put('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    await supabase
      .from('update_notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.userId);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/user/scripts/:scriptId/download - Télécharger un build
// ══════════════════════════════════════════════════════════════════════
router.get('/scripts/:scriptId/download', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { scriptId } = req.params;

    // Vérifier que l'user possède ce script
    const { data: userScript, error: usError } = await supabase
      .from('user_scripts')
      .select('*, scripts(id, name, slug, short_description)')
      .eq('user_id', userId)
      .eq('script_id', scriptId)
      .single();

    if (usError || !userScript) {
      return res.status(403).json({ success: false, error: 'Script non possédé' });
    }

    const script = userScript.scripts as any;
    const scriptSlug = script.slug;
    const scriptName = script.name;

    // Récupérer les infos user
    const { data: userData } = await supabase
      .from('users')
      .select('email, username')
      .eq('id', userId)
      .single();

    const pseudo = userData?.username || userData?.email?.split('@')[0] || 'Client';
    const email = userData?.email || '';

    // Chercher un build existant pour cet user + script
    const { data: existingBuild } = await supabase
      .from('builds')
      .select('storage_path, filename, license_key')
      .eq('buyer_email', email)
      .eq('script_id', scriptId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let downloadUrl: string | null = null;

    if (existingBuild?.storage_path) {
      // Regénérer un lien frais (signed URL)
      downloadUrl = await getDownloadUrl(existingBuild.storage_path);
    }

    if (!downloadUrl) {
      // Générer un nouveau build
      console.log(`[Download] Generating build for ${pseudo} | ${scriptSlug}`);
      const baseCode = await getBaseScript(scriptSlug);

      if (!baseCode) {
        return res.status(404).json({ success: false, error: 'Fichier source introuvable dans le bucket. Contactez le support.' });
      }

      const result = generateLicense(baseCode, pseudo, email, scriptSlug);
      const orderId = userScript.order_id || userId;
      const storagePath = await storeBuild(result.filename, result.protectedCode, orderId);

      if (!storagePath) {
        return res.status(500).json({ success: false, error: 'Erreur lors de la génération du fichier' });
      }

      downloadUrl = await getDownloadUrl(storagePath);

      // Sauvegarder en DB
      await supabase.from('builds').insert({
        order_id: userScript.order_id || null,
        script_id: scriptId,
        buyer_pseudo: pseudo,
        buyer_email: email,
        license_key: result.licenseKey,
        watermark: result.watermark,
        filename: result.filename,
        storage_path: storagePath,
        script_name: scriptName,
      });

      // Mettre à jour license_key dans user_scripts
      await supabase
        .from('user_scripts')
        .update({ license_key: result.licenseKey })
        .eq('user_id', userId)
        .eq('script_id', scriptId);

      console.log(`[Download] ✅ Build généré: ${result.filename}`);
    }

    return res.json({ success: true, downloadUrl, filename: existingBuild?.filename || `ZEUS_PRENIUM_${scriptSlug.toUpperCase()}.gpc` });
  } catch (error) {
    console.error('[Download] Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
