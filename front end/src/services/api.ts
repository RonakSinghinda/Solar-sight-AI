// API client — plug in your Django backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    };

    if (options?.headers) {
      const extraHeaders = new Headers(options.headers);
      extraHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } catch (err) {
    console.error('[API]', err);
    return null;
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

// Typed endpoint helpers — extend as you build Django views
export const inspectionsApi = {
  list: () => api.get('/inspections/'),
  get: (id: string) => api.get(`/inspections/${id}/`),
  upload: (data: FormData) =>
    fetch(`${API_BASE}/inspections/`, { 
      method: 'POST', 
      headers: getAuthHeaders(), // Do not set Content-Type, let browser set it for FormData
      body: data 
    }).then(r => r.json()),
  simulateScan: () => api.post('/inspections/simulate-scan/', {}),
};

export const panelsApi = {
  list: (sectorId: string) => api.get(`/panels/?sector=${sectorId}`),
};

export const reportsApi = {
  list: () => api.get('/reports/'),
  generate: (inspectionId: string) => api.post('/reports/generate/', { inspection_id: inspectionId }),
};

export const notificationsApi = {
  list: () => api.get('/notifications/'),
  markAllRead: () => api.post('/notifications/mark-all-read/', {}),
};


export const mapApi = {
  getFaultPoints: async (filters?: { fault_type?: string; date_from?: string }) => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters ?? {}).filter(([, v]) => v !== undefined)
      ) as Record<string, string>
    );
    const url = `${API_BASE}/dashboard/map/${params.toString() ? '?' + params : ''}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};

