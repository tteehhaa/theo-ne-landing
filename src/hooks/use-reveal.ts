import { useEffect, useRef, useState } from 'react';

/**
 * Flips `go` to true once the element scrolls into view (or immediately when
 * the visitor prefers reduced motion, or the browser lacks
 * IntersectionObserver). The starting state is only ever applied under
 * `<html class="js">`, so a client that never runs JS sees the finished layout.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      setGo(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setGo(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, go };
}
