import type { SectionMeta } from '@/types/content';
import { Reveal } from './Reveal';
import { cn } from './cn';

/** The prototype's section header: index + eyebrow, big title, side description. */
export function SectionHeading({ meta, className }: { meta: SectionMeta; className?: string }) {
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end md:gap-8',
        className,
      )}
    >
      <div>
        <div className="micro text-accent-alt mb-4">
          {meta.index} / {meta.eyebrow}
        </div>
        <h2 className="m-0 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] font-normal tracking-[-0.045em]">
          {meta.title.map((line, i) => (
            <span key={line} className="block">
              {line}
              {i < meta.title.length - 1 ? <br className="hidden sm:inline" /> : null}
            </span>
          ))}
        </h2>
      </div>
      {meta.description ? (
        <p className="text-muted m-0 max-w-[330px] text-sm leading-[1.7]">{meta.description}</p>
      ) : null}
    </Reveal>
  );
}
