import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './lib/config';

// Import routes
import checkoutRoutes from './routes/checkout';
import webhooksRoutes from './routes/webhooks';
import scriptsRoutes from './routes/scripts';
import supportRoutes from './routes/support';
import adminRoutes from './routes/admin';

const app = express();

// ============================================
// CORS Configuration
// ============================================
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ============================================
// Body Parsing
// ============================================
// IMPORTANT: Webhook route needs raw body for Stripe signature verification
// This MUST be before express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// JSON body parser for all other routes
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// ============================================
// Request Logging
// ============================================
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// Health Check
// ============================================
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ============================================
// API Routes
// ============================================
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/scripts', scriptsRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: config.isProduction ? 'Internal server error' : err.message,
  });
});

// ============================================
// Start Server
// ============================================
app.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║               ZEN SCRIPTS SHOP - BACKEND API                 ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 Server running on port ${String(config.port).padEnd(32)}║
║  🌍 Environment: ${config.nodeEnv.padEnd(40)}║
║  🔗 Frontend: ${config.frontendUrl.padEnd(44).slice(0,44)}║
║  🏠 Site URL: ${config.siteUrl.padEnd(44).slice(0,44)}║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
