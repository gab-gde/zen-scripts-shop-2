import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase, Script } from '../lib/supabase';
import { requireAdmin, setAdminSession, clearAdminSession, validateAdminPassword } from '../middleware/auth';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  password: z.string().min(1, 'Password required'),
});

const scriptSchema = z.object({
  name: z.string().min(1, 'Name required').max(100),
  slug: z.string().min(1, 'Slug required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  short_description: z.string().min(1, 'Short description required').max(300),
  description: z.string().min(1, 'Description required'),
  price_cents: z.number().int().min(0, 'Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('EUR'),
  images: z.array(z.string().url()).default([]),
  video_url: z.string().url().nullable().optional(),
  is_active: z.boolean().default(true),
});

// ============================================
// AUTH ROUTES (No middleware required)
// ============================================

// POST /api/admin/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Password required',
      });
    }

    const { password } = validation.data;

    if (!validateAdminPassword(password)) {
      console.log('[ADMIN] Invalid login attempt');
      return res.status(401).json({
        success: false,
        error: 'Invalid password',
      });
    }

    setAdminSession(res);
    console.log('[ADMIN] Login successful');

    res.json({
      success: true,
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('[ADMIN] Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

// POST /api/admin/logout
router.post('/logout', (req: Request, res: Response) => {
  clearAdminSession(res);
  console.log('[ADMIN] Logout');
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// GET /api/admin/check - Check if logged in
router.get('/check', requireAdmin, (req: Request, res: Response) => {
  res.json({
    success: true,
    authenticated: true,
  });
});

// ============================================
// SCRIPTS MANAGEMENT (Protected)
// ============================================

// GET /api/admin/scripts - List all scripts (including inactive)
router.get('/scripts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data: scripts, error } = await supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ADMIN] Failed to fetch scripts:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch scripts',
      });
    }

    res.json({
      success: true,
      scripts: scripts || [],
    });
  } catch (error) {
    console.error('[ADMIN] Scripts list error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// POST /api/admin/scripts - Create new script
router.post('/scripts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const validation = scriptSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validation.error.errors,
      });
    }

    const scriptData = validation.data;

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('scripts')
      .select('id')
      .eq('slug', scriptData.slug)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'A script with this slug already exists',
      });
    }

    const { data: script, error } = await supabase
      .from('scripts')
      .insert(scriptData)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN] Failed to create script:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create script',
      });
    }

    console.log(`[ADMIN] Script created: ${scriptData.name}`);

    res.status(201).json({
      success: true,
      script,
    });
  } catch (error) {
    console.error('[ADMIN] Create script error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// PUT /api/admin/scripts/:id - Update script
router.put('/scripts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    if (!z.string().uuid().safeParse(id).success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid script ID',
      });
    }

    const validation = scriptSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validation.error.errors,
      });
    }

    const updateData = validation.data;

    // Check if script exists
    const { data: existing } = await supabase
      .from('scripts')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Script not found',
      });
    }

    // If updating slug, check for uniqueness
    if (updateData.slug) {
      const { data: slugExists } = await supabase
        .from('scripts')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', id)
        .single();

      if (slugExists) {
        return res.status(400).json({
          success: false,
          error: 'A script with this slug already exists',
        });
      }
    }

    const { data: script, error } = await supabase
      .from('scripts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN] Failed to update script:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update script',
      });
    }

    console.log(`[ADMIN] Script updated: ${id}`);

    res.json({
      success: true,
      script,
    });
  } catch (error) {
    console.error('[ADMIN] Update script error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// DELETE /api/admin/scripts/:id - Delete script (soft delete)
router.delete('/scripts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!z.string().uuid().safeParse(id).success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid script ID',
      });
    }

    // Soft delete - just set inactive
    const { error } = await supabase
      .from('scripts')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('[ADMIN] Failed to delete script:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete script',
      });
    }

    console.log(`[ADMIN] Script deleted (soft): ${id}`);

    res.json({
      success: true,
      message: 'Script deleted successfully',
    });
  } catch (error) {
    console.error('[ADMIN] Delete script error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// ============================================
// ORDERS MANAGEMENT (Protected)
// ============================================

// GET /api/admin/orders - List all orders
router.get('/orders', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        scripts (name, slug)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ADMIN] Failed to fetch orders:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch orders',
      });
    }

    res.json({
      success: true,
      orders: orders || [],
    });
  } catch (error) {
    console.error('[ADMIN] Orders list error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// ============================================
// SUPPORT MESSAGES (Protected)
// ============================================

// GET /api/admin/support - List support messages
router.get('/support', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data: messages, error } = await supabase
      .from('support_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ADMIN] Failed to fetch support messages:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch messages',
      });
    }

    res.json({
      success: true,
      messages: messages || [],
    });
  } catch (error) {
    console.error('[ADMIN] Support messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// PUT /api/admin/support/:id/read - Mark message as read
router.put('/support/:id/read', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('support_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update message',
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// ============================================
// STATS (Protected)
// ============================================

// GET /api/admin/stats - Get dashboard stats
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
    console.error('[ADMIN] Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
