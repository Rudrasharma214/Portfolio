import { useEffect, useRef, useState } from 'react';
import { profile } from '@/content';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from './cn';

/** Hold the splash at least this long, so it reads as intentional rather than a flash. */
const MIN_MS = 1100;
/** Never hold it longer than this, even if something is still downloading. */
const MAX_MS = 2800;
/** Length of the fade-out, kept in sync with the CSS duration below. */
const EXIT_MS = 620;

/**
 * First-paint splash: monogram, domain, and a bar that tracks loading.
 *
 * Mounted above the router so it runs once per page load, never on a route
 * change. Skipped outright when motion is off — a visitor who asked for less
 * animation should not be made to sit through an animated gate.
 */
export function Loader({ onDone, skip }: { onDone: () => void; skip: boolean }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  useLockBodyScroll(!skip && !leaving);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }

    const start = performance.now();
    let raf = 0;

    const finish = () => {
      if (done.current) return;
      done.current = true;
      setProgress(100);
      setLeaving(true);
      window.setTimeout(onDone, EXIT_MS);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = document.readyState === 'complete';

      // Climb quickly to 90%, then wait for the page to actually be ready.
      // Without the ceiling the bar would claim to be finished before it is.
      const ceiling = ready && elapsed >= MIN_MS ? 100 : 90;
      const next = Math.min(ceiling, (elapsed / MIN_MS) * 90);
      setProgress(next);

      if (next >= 100 || elapsed >= MAX_MS) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, skip]);

  if (skip) return null;

  const host = profile.website.replace(/^https?:\/\//, '');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={cn(
        'fixed inset-0 z-[100] grid place-items-center bg-bg transition-opacity duration-500 ease-out',
        leaving && 'pointer-events-none opacity-0',
      )}
    >
      <div className="flex flex-col items-center px-6">
        <div className="grid h-[132px] w-[150px] place-items-center rounded-sm border border-line-strong/60">
          <span className="text-[56px] leading-none font-bold tracking-[-0.04em] text-ink">
            {profile.monogram}
          </span>
        </div>

        <span className="micro mt-7 text-[11px] tracking-[0.35em] text-faint">{host}</span>

        <div className="mt-6 h-px w-[250px] max-w-full overflow-hidden bg-line">
          <div
            className="h-full bg-accent transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
