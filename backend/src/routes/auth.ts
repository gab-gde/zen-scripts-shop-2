import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import { requireUser, generateToken, JwtPayload } from '../middleware/user-auth';
import { awardPoints } from '../services/points';

const router = Router();

// ══════════════════════════════════════════════════════════════════════
// VALIDATION SCHEMAS
// ══════════════════════════════════════════════════════════════════════
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe minimum 8 caractères'),
  username: z.string()
    .min(3, 'Pseudo minimum 3 caractères')
    .max(20, 'Pseudo maximum 20 caractères')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Pseudo: lettres, chiffres, tirets et underscores uniquement'),
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  avatar_url: z.string().url().nullable().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Nouveau mot de passe minimum 8 caractères'),
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/auth/register
// ══════════════════════════════════════════════════════════════════════
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        error: validation.error.errors[0]?.message || 'Validation error' 
      });
    }

    const { email, password, username } = validation.data;

    // Check existing email
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingEmail) {
      return res.status(409).json({ success: false, error: 'Cet email est déjà utilisé' });
    }

    // Check existing username
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .single();

    if (existingUsername) {
      return res.status(409).json({ success: false, error: 'Ce pseudo est déjà pris' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        username: username.toLowerCase(),
        points_balance: config.points.welcomeBonus,
      })
      .select('id, email, username, points_balance, is_subscribed, subscription_tier, created_at')
      .single();

    if (insertError || !user) {
      console.error('[Auth] Register error:', insertError);
      return res.status(500).json({ success: false, error: 'Erreur lors de la création du compte' });
    }

    // Award welcome bonus points
    await awardPoints(user.id, config.points.welcomeBonus, 'welcome_bonus', 'Bonus de bienvenue');

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Set cookie
    setUserCookie(res, token);

    console.log(`[Auth] New user registered: ${user.username} (${user.email})`);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        points_balance: user.points_balance,
        is_subscribed: user.is_subscribed,
        subscription_tier: user.subscription_tier,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ══════════════════════════════════════════════════════════════════════
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        error: validation.error.errors[0]?.message || 'Validation error' 
      });
    }

    const { email, password } = validation.data;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Set cookie
    setUserCookie(res, token);

    console.log(`[Auth] Login: ${user.username}`);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        points_balance: user.points_balance,
        is_subscribed: user.is_subscribed,
        subscription_tier: user.subscription_tier,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// ══════════════════════════════════════════════════════════════════════
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('user_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  return res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/auth/me - Get current user profile
// ══════════════════════════════════════════════════════════════════════
router.get('/me', requireUser, async (req: Request, res: Response) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, avatar_url, points_balance, is_subscribed, subscription_tier, subscription_expires_at, created_at')
      .eq('id', req.user!.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// PUT /api/auth/profile - Update profile
// ══════════════════════════════════════════════════════════════════════
router.put('/profile', requireUser, async (req: Request, res: Response) => {
  try {
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation error' });
    }

    const updates: any = { updated_at: new Date().toISOString() };

    if (validation.data.username) {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', validation.data.username.toLowerCase())
        .neq('id', req.user!.userId)
        .single();

      if (existing) {
        return res.status(409).json({ success: false, error: 'Ce pseudo est déjà pris' });
      }
      updates.username = validation.data.username.toLowerCase();
    }

    if (validation.data.avatar_url !== undefined) {
      updates.avatar_url = validation.data.avatar_url;
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user!.userId)
      .select('id, email, username, avatar_url, points_balance, is_subscribed, subscription_tier, created_at')
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to update profile' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// PUT /api/auth/password - Change password
// ══════════════════════════════════════════════════════════════════════
router.put('/password', requireUser, async (req: Request, res: Response) => {
  try {
    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0]?.message });
    }

    const { currentPassword, newPassword } = validation.data;

    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.user!.userId)
      .single();

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Mot de passe actuel incorrect' });
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    await supabase
      .from('users')
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq('id', req.user!.userId);

    return res.json({ success: true, message: 'Mot de passe mis à jour' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// HELPER
// ══════════════════════════════════════════════════════════════════════
function setUserCookie(res: Response, token: string) {
  res.cookie('user_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export default router;
