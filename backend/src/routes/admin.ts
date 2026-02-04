import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase, Script } from '../lib/supabase';
import { requireAdmin, setAdminSession, clearAdminSession, validateAdminPassword } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  password: z.string().min(1, 'Password required'),
});

const scriptSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  short_description: z.string().min(1).max(300),
  description: z.string().min(1),
  price_cents: z.number().int().min(0),
  currency: z.string().length(3).default('EUR'),
  images: z.array(z.string().url()).default([]),
  video_url: z.string().url().nullable().optional(),
  is_active: z.boolean().default(true),
});

// POST /api/admin/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Password required' });
    }

    const { password } = validation.data;

    if (!validateAdminPassword(password)) {
      console.log('[ADMIN] Invalid login attempt');
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    setAdminSession(res);
    console.log('[ADMIN] Login successful');
    res.json({ success: true, message: 'Logged in' });
  } catch (error) {
    console.error('[ADMIN] Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// POST /api/admin/logout
router.post('/logout', (req: Request, res: Response) => {
  clearAdminSession(res);
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/admin/check
router.get('/check', requireAdmin, (req: Request, res: Response) => {
  res.json({ success: true, authenticated: true });
});

// GET /api/admin/scripts
router.get('/scripts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data: scripts, error } = await supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch scripts' });
    }

    res.json({ success: true, scripts: scripts || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/admin/scripts
router.post('/scripts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const validation = scriptSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation error', details: validation.error.errors });
    }

    const scriptData = validation.data;

    const { data: existing } = await supabase.from('scripts').select('id').eq('slug', scriptData.slug).single();
    if (existing) {
      return res.status(400).json({ success: false, error: 'Slug already exists' });
    }

    const { data: script, error } = await supabase.from('scripts').insert(scriptData).select().single();

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to create script' });
    }

    res.status(201).json({ success: true, script });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/admin/scripts/:id
router.put('/scripts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validation = scriptSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation error' });
    }

    const { data: script, error } = await supabase
      .from('scripts')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to update script' });
    }

    res.json({ success: true, script });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/admin/scripts/:id
router.delete('/scripts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('scripts').update({ is_active: false }).eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to delete script' });
    }

    res.json({ success: true, message: 'Script deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/admin/orders
router.get('/orders', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`*, scripts (name, slug)`)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }

    res.json({ success: true, orders: orders || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [scriptsResult, ordersResult, messagesResult] = await Promise.all([
      supabase.from('scripts').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('orders').select('id, amount_cents', { count: 'exact' }),
      supabase.from('support_messages').select('id', { count: 'exact' }).eq('is_read', false),
    ]);

    const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (order.amount_cents || 0), 0) || 0;

    res.json({
      success: true,
      stats: {
        totalScripts: scriptsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalRevenue: totalRevenue / 100,
        currency: 'EUR',
        unreadMessages: messagesResult.count || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
