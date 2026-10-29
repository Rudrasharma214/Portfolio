import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MotionState {
  /** True when decorative animation should be suppressed. */
  paused: boolean;
  /** True when the OS asked for reduced motion (the toggle can still override). */
  systemReduced: boolean;
  toggle: () => void;
}

const MotionContext = createContext<MotionState | null>(null);

/**
 * Global motion switch. Seeded from `prefers-reduced-motion` and overridable by
 * the footer toggle. Also mirrors state onto <html> as `.motion-paused` so pure
 * CSS animations can be halted without each component subscribing.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = useReducedMotion();
  const [override, setOverride] = useState<boolean | null>(null);

  const paused = override ?? systemReduced;

  // A later OS change should win until the visitor touches the toggle again.
  useEffect(() => {
    setOverride(null);
  }, [systemReduced]);

  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', paused);
  }, [paused]);

  const toggle = useCallback(() => setOverride(!paused), [paused]);

  const value = useMemo<MotionState>(
    () => ({ paused, systemReduced, toggle }),
    [paused, systemReduced, toggle],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionState {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotion must be used inside <MotionProvider>');
  return ctx;
}
