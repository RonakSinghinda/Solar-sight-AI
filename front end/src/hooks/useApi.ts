import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(endpoint: string, dependencies?: any[]): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });
      const { data, error } = await api.get<T>(endpoint);
      if (isMounted) {
        if (error) {
          setState({ data: null, loading: false, error });
        } else {
          setState({ data, loading: false, error: null });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies || [endpoint]);

  return state;
}

export function useMutation<T>(
  method: 'post' | 'put' | 'patch' | 'delete' = 'post'
): [(endpoint: string, data?: any) => Promise<T | null>, { loading: boolean; error: string | null }] {
  const [state, setState] = useState({ loading: false, error: null as string | null });

  const mutate = useCallback(
    async (endpoint: string, data?: any): Promise<T | null> => {
      setState({ loading: true, error: null });
      try {
        const result = await api[method]<T>(endpoint, data);
        if (result.error) {
          setState({ loading: false, error: result.error });
          return null;
        }
        setState({ loading: false, error: null });
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        setState({ loading: false, error });
        return null;
      }
    },
    [method]
  );

  return [mutate, state];
}
