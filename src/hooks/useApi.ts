/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { AxiosRequestConfig } from "axios";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (config: AxiosRequestConfig): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const res = await api(config);
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: any) {
      const error = err.response?.data?.error || "Erro inesperado";
      setState({ data: null, loading: false, error });
      return null;
    }
  }, []);

  return { ...state, request };
}
