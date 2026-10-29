import type { ReactNode } from 'react';
import { cn } from './cn';

/** Mono micro-label with a glowing orange dot — the prototype's section marker. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('micro text-muted flex items-center gap-3', className)}>
      <span
        aria-hidden
        className="bg-orange size-1.5 shrink-0 rounded-full shadow-[0_0_12px_rgba(255,107,26,0.45)]"
      />
      {children}
    </div>
  );
}
