import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'quiet' | 'outline';

const base =
  'inline-flex items-center gap-3 text-[13px] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]';

const variants: Record<Variant, string> = {
  primary:
    'justify-between gap-8 rounded border border-accent bg-accent px-6 py-4 font-bold text-bg hover:-translate-y-0.5 hover:bg-accent-soft',
  quiet: 'py-3 text-ink hover:text-accent',
  outline:
    'rounded-full border border-line px-5 py-3 text-ink hover:border-accent hover:text-accent',
};

interface Shared {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: Shared & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...rest
}: Shared & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
