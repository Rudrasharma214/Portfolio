import type { Stat as StatData } from '@/types/content';

/** One figure in the hero stat strip. Numerals use the gold accent. */
export function Stat({ stat }: { stat: StatData }) {
  return (
    <div className="border-line px-0 sm:px-7 sm:not-last:border-r sm:first:pl-0">
      <strong className="text-ink block text-[clamp(1.75rem,3vw,2.4rem)] font-normal tracking-[-0.04em]">
        {stat.value}
        {stat.accent ? <span className="text-gold">{stat.accent}</span> : null}
      </strong>
      <p className="micro text-muted m-0 mt-2.5 text-[10px] leading-[1.6]">{stat.label}</p>
    </div>
  );
}
