import { useCallback } from 'react';
import { getApiErrorMessage } from '@/lib/apiErrors';

export function useApiError() {
  const getErrorMessage = useCallback((error: unknown): string => {
    return getApiErrorMessage(error);
  }, []);

  return { getErrorMessage };
}
