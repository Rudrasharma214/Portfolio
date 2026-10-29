import { cn } from './cn';

export function Tag({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'micro border-line-strong/70 text-ink/70 rounded-sm border px-2 py-1.5 text-[9px] tracking-[0.12em]',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
