import type { ReactNode } from 'react';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useMotion } from '@/context/MotionContext';
import { cn } from './cn';

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

/** Where the element sits before it enters view. */
const resting: Record<RevealVariant, string> = {
  up: 'translate-y-8 opacity-0',
  down: '-translate-y-6 opacity-0',
  left: '-translate-x-10 opacity-0',
  right: 'translate-x-10 opacity-0',
  fade: 'opacity-0',
  scale: 'scale-[0.96] opacity-0',
};

const settled = 'translate-x-0 translate-y-0 scale-100 opacity-100';

/**
 * Animates its children in the first time they scroll into view, then stops
 * observing — content never fades back out on scroll-up.
 *
 * With motion paused the children are rendered plainly and never hidden, so
 * the page stays readable regardless of animation support.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 700,
  className,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  /** Stagger in ms, for siblings revealed together. */
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const { paused } = useMotion();
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();

  if (paused) return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      className={cn(
        'transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]',
        revealed ? settled : resting[variant],
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: revealed && delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Reveals a list of children one after another from a single observer, so a
 * row of cards ripples in rather than all arriving at once.
 */
export function RevealGroup({
  children,
  variant = 'up',
  step = 90,
  className,
  itemClassName,
}: {
  children: ReactNode[];
  variant?: RevealVariant;
  /** Gap between consecutive children, in ms. */
  step?: number;
  className?: string;
  itemClassName?: string;
}) {
  const { paused } = useMotion();
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();

  if (paused) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          className={cn(
            'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]',
            revealed ? settled : resting[variant],
            itemClassName,
          )}
          style={{ transitionDelay: revealed ? `${i * step}ms` : undefined }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
