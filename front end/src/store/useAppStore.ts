import { create } from 'zustand';
import { api } from '@/services/api';

interface User {
  id: string;
  username?: string;
  email?: string;
  role?: 'admin' | 'operator' | 'viewer';
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;

  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),
  setError: (error) => set({ error }),

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await api.post<{ access: string; refresh: string }>('/auth/login/', {
        username,
        password,
      });

      if (error || !data) {
        set({ isLoading: false, error: error || 'Login failed', isAuthenticated: false });
        return false;
      }

      api.setTokens(data.access, data.refresh);
      
      // Decode JWT to get user info (basic payload extraction)
      try {
        const payload = JSON.parse(atob(data.access.split('.')[1]));
        set({
          user: {
            id: payload.user_id?.toString() || '',
            username: payload.username || 'User',
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch {
        set({
          user: { id: '', username: 'User' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Login failed';
      set({ isLoading: false, error, isAuthenticated: false });
      return false;
    }
  },

  logout: () => {
    api.clearTokens();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: () => {
    const token = api.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        set({
          user: {
            id: payload.user_id?.toString() || '',
            username: payload.username || 'User',
          },
          isAuthenticated: true,
        });
      } catch {
        set({ isAuthenticated: false, user: null });
      }
    }
  },

  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
}));
