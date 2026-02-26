import { Router, Request, Response } from 'express';
import { supabase, Script } from '../lib/supabase';

const router = Router();

// GET /api/scripts - List all active scripts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    let query = supabase
      .from('scripts')
      .select('id, name, slug, short_description, price_cents, currency, images, video_url, is_active, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (search && typeof search === 'string' && search.trim()) {
      query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    const { data: scripts, error } = await query;

    if (error) {
      console.error('[SCRIPTS] Failed to fetch:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch scripts' });
    }

    res.json({ success: true, scripts: scripts || [] });
  } catch (error) {
    console.error('[SCRIPTS] Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/scripts/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data: script, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !script) {
      return res.status(404).json({ success: false, error: 'Script not found' });
    }

    res.json({ success: true, script });
  } catch (error) {
    console.error('[SCRIPTS] Fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
