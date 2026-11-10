import { useEffect } from 'react';
import { scrollStore } from './store';

/** Reduced motion: no scrubbing. Whichever [data-progress] block is on screen sets the scene. */
export function useFlowProgress(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const p = Number((e.target as HTMLElement).dataset.progress);
          if (Number.isFinite(p)) scrollStore.set(p, 0);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }, // the block crossing the middle of the screen
    );
    document.querySelectorAll('[data-progress]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
}
