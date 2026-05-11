// API client with JWT authentication
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Token management
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/login/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) throw new Error('Refresh failed');
    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    return true;
  } catch (err) {
    clearTokens();
    return false;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    let res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // If 401, try refreshing token
    if (res.status === 401 && token) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const newToken = getToken();
        res = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        });
      }
    }

    if (!res.ok) {
      const error = await res.text();
      return { data: null, error: `HTTP ${res.status}: ${error}`, status: res.status };
    }

    const data = await res.json() as T;
    return { data, error: null, status: res.status };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('[API]', error);
    return { data: null, error, status: 0 };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
  setTokens,
  clearTokens,
  getToken,
};

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    request<{ access: string; refresh: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    }),
  register: (username: string, password: string, email: string) =>
    request<{ message: string; user_id: number }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
      headers: { 'Content-Type': 'application/json' },
    }),
};

// Inspections API
export const inspectionsApi = {
  list: () => api.get<any[]>('/inspections/'),
  get: (id: string) => api.get<any>(`/inspections/${id}/`),
  create: (files: File[]) => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    return fetch(`${API_BASE}/inspections/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json());
  },
};

// Faults API
export const faultsApi = {
  list: () => api.get<any[]>('/faults/'),
  get: (id: string) => api.get<any>(`/faults/${id}/`),
  listByInspection: (inspectionId: string) => api.get<any[]>(`/faults/?inspection=${inspectionId}`),
};

// Panels API
export const panelsApi = {
  list: () => api.get<any[]>('/panels/'),
  get: (id: string) => api.get<any>(`/panels/${id}/`),
  listBySector: (sectorId: string) => api.get<any[]>(`/panels/?sector=${sectorId}`),
};

// Reports API
export const reportsApi = {
  list: () => api.get<any[]>('/reports/'),
  get: (id: string) => api.get<any>(`/reports/${id}/`),
  generate: (inspectionId: string) =>
    api.post<{ message: string; report_id: string; url: string }>('/reports/generate/', { inspection_id: inspectionId }),
};

// Dashboard API
export const dashboardApi = {
  summary: () => api.get<{
    total_inspections: number;
    total_faults: number;
    open_faults: number;
  }>('/dashboard/summary/'),
};
