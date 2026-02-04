const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

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
  scripts?: { name: string };
}

export const getScripts = async (search?: string): Promise<Script[]> => {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const data = await fetchApi<{ scripts: Script[] }>(`/api/scripts${params}`);
  return data.scripts || [];
};

export const getScriptBySlug = async (slug: string): Promise<Script | null> => {
  try {
    const data = await fetchApi<{ script: Script }>(`/api/scripts/${slug}`);
    return data.script;
  } catch {
    return null;
  }
};

export const createCheckoutSession = async (scriptId: string): Promise<{ url: string }> => {
  const data = await fetchApi<{ url: string }>('/api/checkout/create-session', {
    method: 'POST',
    body: JSON.stringify({ scriptId }),
  });
  return { url: data.url };
};

export const getCheckoutSession = async (sessionId: string) => {
  try {
    const data = await fetchApi<{ order: any }>(`/api/checkout/session/${sessionId}`);
    return data.order;
  } catch {
    return null;
  }
};

export const sendSupportMessage = async (data: { email: string; subject: string; message: string }) => {
  return fetchApi('/api/support', { method: 'POST', body: JSON.stringify(data) });
};

export const adminLogin = async (password: string): Promise<boolean> => {
  try {
    await fetchApi('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
    return true;
  } catch {
    return false;
  }
};

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
