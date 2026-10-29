import { SHAPE_LABELS, SHAPE_ORDER, type ShapeId } from './shapes';
import { cn } from '@/components/ui/cn';

/** The three shape buttons beneath the canvas. */
export function SceneControls({
  mode,
  onChange,
}: {
  mode: ShapeId;
  onChange: (next: ShapeId) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Scene shape"
      className="border-line bg-bg absolute bottom-[-16px] left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-full border p-[5px]"
    >
      {SHAPE_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={mode === id}
          className={cn(
            'micro rounded-full px-4 py-2.5 text-[10px] transition-colors',
            mode === id ? 'bg-line-strong/50 text-ink' : 'text-muted hover:text-ink',
          )}
        >
          {SHAPE_LABELS[id].label}
        </button>
      ))}
    </div>
  );
}
