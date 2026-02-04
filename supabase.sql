-- ============================================
-- ZEN SCRIPTS SHOP - DATABASE SCHEMA
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SCRIPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    currency TEXT NOT NULL DEFAULT 'EUR',
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for scripts
CREATE INDEX IF NOT EXISTS idx_scripts_slug ON scripts(slug);
CREATE INDEX IF NOT EXISTS idx_scripts_active ON scripts(is_active);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE RESTRICT,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    stripe_session_id TEXT UNIQUE NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_script_id ON orders(script_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ============================================
-- SUPPORT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for support_messages
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_is_read ON support_messages(is_read);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Using service role key in backend, so RLS policies allow all via service role

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Policies for service role (full access)
CREATE POLICY "Service role full access on scripts" ON scripts
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on orders" ON orders
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on support_messages" ON support_messages
    FOR ALL USING (true) WITH CHECK (true);
