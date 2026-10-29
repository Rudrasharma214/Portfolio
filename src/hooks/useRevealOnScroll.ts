import { useEffect, useRef, useState } from 'react';

/**
 * One-shot reveal: flips to true the first time the element enters view and
 * then stops observing, so content never fades back out on scroll-up.
 */
export function useRevealOnScroll<T extends Element>(threshold = 0.08) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already on screen at mount (e.g. a short page) — reveal without waiting.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
