import { useMotion } from '@/context/MotionContext';

/** Lets the visitor stop or restart decorative animation site-wide. */
export function MotionToggle() {
  const { paused, toggle } = useMotion();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className="micro border-line text-muted hover:border-orange hover:text-orange rounded-full border px-3 py-2 text-[9px] transition-colors"
    >
      Motion: {paused ? 'off' : 'on'}
    </button>
  );
}
