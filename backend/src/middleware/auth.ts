import { Request, Response, NextFunction } from 'express';
import { config } from '../lib/config';

// Extend Express Request to include admin flag
declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_TOKEN = 'zen_admin_authenticated';

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const sessionCookie = req.cookies[ADMIN_SESSION_COOKIE];

  if (sessionCookie === SESSION_TOKEN) {
    req.isAdmin = true;
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Unauthorized - Admin access required',
    });
  }
}

export function setAdminSession(res: Response): void {
  res.cookie(ADMIN_SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });
}

export function clearAdminSession(res: Response): void {
  res.clearCookie(ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: 'lax',
    path: '/',
  });
}

export function validateAdminPassword(password: string): boolean {
  return password === config.admin.password;
}
