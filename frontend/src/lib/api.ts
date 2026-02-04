const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  details?: any;
  [key: string]: any;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ============================================
// Types
// ============================================

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
  scripts?: { name: string; slug: string };
}

export interface SupportMessage {
  id: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ============================================
// Scripts API
// ============================================

export async function getScripts(search?: string): Promise<Script[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetchApi<{ scripts: Script[] }>(`/api/scripts${params}`);
  return response.scripts || [];
}

export async function getScriptBySlug(slug: string): Promise<Script | null> {
  try {
    const response = await fetchApi<{ script: Script }>(`/api/scripts/${slug}`);
    return response.script || null;
  } catch {
    return null;
  }
}

// ============================================
// Checkout API
// ============================================

export async function createCheckoutSession(
  scriptId: string,
  email?: string
): Promise<{ url: string }> {
  const response = await fetchApi<{ url: string }>('/api/checkout/create-session', {
    method: 'POST',
    body: JSON.stringify({ scriptId, email }),
  });
  return { url: response.url };
}

export async function getCheckoutSession(sessionId: string): Promise<{
  orderNumber: string;
  scriptName: string;
  amount: string;
  email: string;
} | null> {
  try {
    const response = await fetchApi<{ order: any }>(`/api/checkout/session/${sessionId}`);
    return response.order || null;
  } catch {
    return null;
  }
}

// ============================================
// Support API
// ============================================

export async function sendSupportMessage(data: {
  email: string;
  subject: string;
  message: string;
}): Promise<{ message: string }> {
  const response = await fetchApi<{ message: string }>('/api/support', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { message: response.message };
}

// ============================================
// Admin API
// ============================================

export async function adminLogin(password: string): Promise<boolean> {
  try {
    await fetchApi('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  await fetchApi('/api/admin/logout', { method: 'POST' });
}

export async function adminCheckAuth(): Promise<boolean> {
  try {
    await fetchApi('/api/admin/check');
    return true;
  } catch {
    return false;
  }
}

export async function adminGetScripts(): Promise<Script[]> {
  const response = await fetchApi<{ scripts: Script[] }>('/api/admin/scripts');
  return response.scripts || [];
}

export async function adminCreateScript(data: Partial<Script>): Promise<Script> {
  const response = await fetchApi<{ script: Script }>('/api/admin/scripts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.script;
}

export async function adminUpdateScript(id: string, data: Partial<Script>): Promise<Script> {
  const response = await fetchApi<{ script: Script }>(`/api/admin/scripts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.script;
}

export async function adminDeleteScript(id: string): Promise<void> {
  await fetchApi(`/api/admin/scripts/${id}`, { method: 'DELETE' });
}

export async function adminGetOrders(): Promise<Order[]> {
  const response = await fetchApi<{ orders: Order[] }>('/api/admin/orders');
  return response.orders || [];
}

export async function adminGetSupport(): Promise<SupportMessage[]> {
  const response = await fetchApi<{ messages: SupportMessage[] }>('/api/admin/support');
  return response.messages || [];
}

export async function adminGetStats(): Promise<{
  totalScripts: number;
  totalOrders: number;
  totalRevenue: number;
  currency: string;
  unreadMessages: number;
}> {
  const response = await fetchApi<{ stats: any }>('/api/admin/stats');
  return response.stats;
}
