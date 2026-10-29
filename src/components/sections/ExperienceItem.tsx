import type { Experience } from '@/types/content';
import { TagList } from '@/components/ui/Tag';

export function ExperienceItem({ item, open }: { item: Experience; open?: boolean }) {
  const period = item.end ? `${item.start} — ${item.end}` : `${item.start} — Present`;

  return (
    <details open={open} className="group border-line border-b">
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-5 gap-y-1 py-6 md:grid-cols-[185px_1fr_1fr_32px] md:py-7">
        <span className="micro text-muted col-start-1 text-[10px]">{period}</span>
        <span className="col-start-1 text-xl tracking-[-0.02em] md:col-start-2 md:text-[22px]">
          {item.company}
        </span>
        <span className="text-muted col-start-1 text-[13px] md:col-start-3">
          {item.role}
          <span className="hidden md:inline"> · {item.location}</span>
        </span>
        <span
          aria-hidden
          className="text-muted group-open:text-orange col-start-2 row-start-1 row-end-4 justify-self-end text-[23px] transition-[rotate,color] duration-300 group-open:rotate-45 md:col-start-4 md:row-auto"
        >
          +
        </span>
      </summary>

      <div className="text-muted max-w-[1050px] pr-0 pb-7 text-[13px] leading-[1.85] md:pr-14 md:pl-[205px] md:text-sm">
        <ul className="m-0 list-disc pl-5">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="py-1">
              {bullet}
            </li>
          ))}
        </ul>
        <TagList items={item.tags} className="mt-5" />
      </div>
    </details>
  );
}
