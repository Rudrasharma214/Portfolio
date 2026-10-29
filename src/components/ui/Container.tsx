import type { ReactNode } from 'react';
import { cn } from './cn';

/** The shared page gutter: 1320px max, 40px gutter on phones. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-14', className)}>
      {children}
    </div>
  );
}
