import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether the returned ref is intersecting the viewport.
 * Used to stop the WebGL render loop once the hero scrolls away.
 */
export function useInViewport<T extends Element>(rootMargin = '0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
