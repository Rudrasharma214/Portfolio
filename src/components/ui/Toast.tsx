import { cn } from './cn';

/** Transient confirmation pinned to the bottom of the viewport. */
export function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'bg-ink text-bg fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full px-5 py-3 text-xs transition-opacity duration-200',
        message ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {message ?? ''}
    </div>
  );
}
