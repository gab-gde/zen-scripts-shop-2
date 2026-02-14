import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './lib/config';
import checkoutRoutes from './routes/checkout';
import webhooksRoutes from './routes/webhooks';
import scriptsRoutes from './routes/scripts';
import supportRoutes from './routes/support';
import adminRoutes from './routes/admin';
import adminBuildsRoutes from './routes/admin-builds';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import subscriptionRoutes from './routes/subscription';

const app = express();

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Trust proxy (important for Render)
app.set('trust proxy', 1);

// Webhook Stripe - raw body BEFORE express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// JSON parser for other routes
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/scripts', scriptsRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/builds', adminBuildsRoutes);

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start
app.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              ZEN SCRIPTS SHOP - BACKEND API V2               ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 Server running on port ${String(config.port).padEnd(32)}║
║  🌍 Frontend: ${config.frontendUrl.substring(0, 44).padEnd(44)}║
║  🔐 Auth: JWT + Cookie                                      ║
║  💎 Points & Subscriptions: Active                           ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
