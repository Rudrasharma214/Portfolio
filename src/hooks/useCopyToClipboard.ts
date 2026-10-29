import { useCallback } from 'react';

/**
 * Copies text, reporting success so the caller can pick its own message.
 * `navigator.clipboard` is unavailable on insecure origins, hence the boolean.
 */
export function useCopyToClipboard() {
  return useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);
}
