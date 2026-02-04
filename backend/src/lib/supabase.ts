import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Types for database tables
export interface Script {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price_cents: number;
  currency: string;
  images: string[];
  video_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  email: string;
  script_id: string;
  amount_cents: number;
  currency: string;
  stripe_session_id: string;
  payment_status: string;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default supabase;
