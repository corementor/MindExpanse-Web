// src/hooks/useApi.ts
import { useState, useCallback } from "react";
import { httpClient } from "@/services/HttpClient";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(
    async <T>(
      method: "get" | "post" | "put" | "delete",
      url: string,
      data?: any,
      config?: any
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await httpClient[method]<T>(url, data, config);
        return response;
      } catch (err: any) {
        // Error is already handled by the interceptor
        // We just need to set the local error state
        const errorMessage = err.response?.data?.message || "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};
