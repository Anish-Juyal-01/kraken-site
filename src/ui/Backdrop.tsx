import { useEffect, useRef } from 'react';
import { scrollStore } from '../scroll/store';

/** First-screen artwork that sits behind the kraken and the near water (giant type, a sun,
 *  a boat). It lifts and fades as the dive begins, and never comes back. */
export function Backdrop({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      scrollStore.subscribe((p) => {
        if (!el.current) return;
        const t = Math.min(1, Math.max(0, (p - 0.035) / 0.05));
        el.current.style.opacity = String(1 - t);
        el.current.style.transform = `translate3d(0, ${-t * 14}vh, 0)`;
        el.current.style.display = t >= 1 ? 'none' : '';
      }),
    [],
  );
  return (
    <div ref={el} aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      {children}
    </div>
  );
}
