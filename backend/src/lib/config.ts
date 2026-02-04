import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const config = {
  // Server
  port: parseInt(optionalEnv('PORT', '3001'), 10),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  isProduction: process.env.NODE_ENV === 'production',

  // Supabase
  supabase: {
    url: requireEnv('SUPABASE_URL'),
    serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  },

  // Stripe
  stripe: {
    secretKey: requireEnv('STRIPE_SECRET_KEY'),
    webhookSecret: requireEnv('STRIPE_WEBHOOK_SECRET'),
  },

  // Resend
  resend: {
    apiKey: requireEnv('RESEND_API_KEY'),
  },

  // Admin
  admin: {
    email: requireEnv('ADMIN_EMAIL'),
    password: requireEnv('ADMIN_PASSWORD'),
  },

  // URLs
  siteUrl: requireEnv('SITE_URL'),
  frontendUrl: optionalEnv('FRONTEND_URL', 'http://localhost:3000'),

  // Cookie
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default config;
