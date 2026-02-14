const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  // Add token from localStorage if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('user_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

// ══════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════
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
  payment_status: string;
  created_at: string;
  buyer_pseudo?: string;
  scripts?: { name: string; slug: string; images?: string[] };
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  points_balance: number;
  is_subscribed: boolean;
  subscription_tier: string | null;
  subscription_expires_at: string | null;
  created_at: string;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

export interface RewardTier {
  id: string;
  name: string;
  points_required: number;
  discount_percent: number;
  is_active: boolean;
}

export interface RewardCode {
  id: string;
  code: string;
  discount_percent: number;
  points_cost: number;
  is_used: boolean;
  expires_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  is_read: boolean;
  build_delivered: boolean;
  created_at: string;
  script_updates: {
    version: string;
    changelog: string;
    is_major: boolean;
    scripts: { name: string; slug: string };
  };
}

// ══════════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════════
export async function authRegister(data: { email: string; password: string; username: string }): Promise<{ user: User; token: string }> {
  const result = await fetchApi<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (result.token) localStorage.setItem('user_token', result.token);
  return result;
}

export async function authLogin(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
  const result = await fetchApi<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (result.token) localStorage.setItem('user_token', result.token);
  return result;
}

export async function authLogout(): Promise<void> {
  try {
    await fetchApi('/api/auth/logout', { method: 'POST' });
  } catch {}
  localStorage.removeItem('user_token');
}

export async function authGetMe(): Promise<User | null> {
  try {
    const data = await fetchApi<{ user: User }>('/api/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

export async function authUpdateProfile(data: { username?: string }): Promise<User> {
  const result = await fetchApi<{ user: User }>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.user;
}

export async function authChangePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
  await fetchApi('/api/auth/password', { method: 'PUT', body: JSON.stringify(data) });
}

// ══════════════════════════════════════════════════════════════════════
// USER DASHBOARD
// ══════════════════════════════════════════════════════════════════════
export async function getUserDashboard() {
  return fetchApi<{ user: User; stats: { totalScripts: number; totalOrders: number; totalSpent: number; unreadNotifications: number } }>('/api/user/dashboard');
}

export async function getUserScripts() {
  const data = await fetchApi<{ scripts: any[] }>('/api/user/scripts');
  return data.scripts || [];
}

export async function getUserOrders(): Promise<Order[]> {
  const data = await fetchApi<{ orders: Order[] }>('/api/user/orders');
  return data.orders || [];
}

export async function getUserPoints() {
  return fetchApi<{
    balance: number;
    transactions: PointsTransaction[];
    tiers: RewardTier[];
    codes: RewardCode[];
  }>('/api/user/points');
}

export async function redeemPoints(tierId: string): Promise<{ code: string; discount_percent: number }> {
  return fetchApi('/api/user/points/redeem', {
    method: 'POST',
    body: JSON.stringify({ tierId }),
  });
}

export async function getUserNotifications(): Promise<Notification[]> {
  const data = await fetchApi<{ notifications: Notification[] }>('/api/user/notifications');
  return data.notifications || [];
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetchApi(`/api/user/notifications/${id}/read`, { method: 'PUT' });
}

// ══════════════════════════════════════════════════════════════════════
// SUBSCRIPTION
// ══════════════════════════════════════════════════════════════════════
export async function getSubscriptionStatus() {
  return fetchApi<{ subscription: any }>('/api/subscription/status');
}

export async function createSubscription(tier: 'pro' | 'elite'): Promise<{ url: string }> {
  return fetchApi('/api/subscription/create', {
    method: 'POST',
    body: JSON.stringify({ tier }),
  });
}

export async function cancelSubscription(): Promise<void> {
  await fetchApi('/api/subscription/cancel', { method: 'POST' });
}

export async function reactivateSubscription(): Promise<void> {
  await fetchApi('/api/subscription/reactivate', { method: 'POST' });
}

// ══════════════════════════════════════════════════════════════════════
// CHECKOUT (with discount support)
// ══════════════════════════════════════════════════════════════════════
export async function createCheckoutSession(scriptId: string, discountCode?: string): Promise<{ url: string }> {
  const data = await fetchApi<{ url: string }>('/api/checkout/create-session', {
    method: 'POST',
    body: JSON.stringify({ scriptId, discountCode }),
  });
  return { url: data.url };
}

export async function validateDiscountCode(code: string): Promise<{ valid: boolean; discount_percent: number }> {
  return fetchApi('/api/checkout/validate-code', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const data = await fetchApi<{ order: any }>(`/api/checkout/session/${sessionId}`);
    return data.order;
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════════
// PUBLIC
// ══════════════════════════════════════════════════════════════════════
export async function getScripts(search?: string): Promise<Script[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const data = await fetchApi<{ scripts: Script[] }>(`/api/scripts${params}`);
  return data.scripts || [];
}

export async function getScriptBySlug(slug: string): Promise<Script | null> {
  try {
    const data = await fetchApi<{ script: Script }>(`/api/scripts/${slug}`);
    return data.script;
  } catch {
    return null;
  }
}

export async function sendSupportMessage(data: { email: string; subject: string; message: string }) {
  return fetchApi('/api/support', { method: 'POST', body: JSON.stringify(data) });
}

// ══════════════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════════════
export async function adminLogin(password: string): Promise<boolean> {
  try {
    await fetchApi('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
    return true;
  } catch {
    return false;
  }
}

export const adminLogout = async () => fetchApi('/api/admin/logout', { method: 'POST' });

export const adminCheckAuth = async (): Promise<boolean> => {
  try {
    await fetchApi('/api/admin/check');
    return true;
  } catch {
    return false;
  }
};

export const adminGetScripts = async (): Promise<Script[]> => {
  const data = await fetchApi<{ scripts: Script[] }>('/api/admin/scripts');
  return data.scripts || [];
};

export const adminUpdateScript = async (id: string, data: Partial<Script>) => {
  return fetchApi(`/api/admin/scripts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const adminGetOrders = async (): Promise<Order[]> => {
  const data = await fetchApi<{ orders: Order[] }>('/api/admin/orders');
  return data.orders || [];
};

export const adminGetStats = async () => {
  const data = await fetchApi<{ stats: any }>('/api/admin/stats');
  return data.stats;
};
