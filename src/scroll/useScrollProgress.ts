import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollStore } from './store';
import { clamp01 } from './stages';

gsap.registerPlugin(ScrollTrigger);

/** Mount once: one ScrollTrigger over the whole page writes progress into the store. */
export function useScrollProgress(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!root.current) return;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => scrollStore.set(clamp01(self.progress), self.getVelocity()),
      onRefresh: (self) => scrollStore.set(clamp01(self.progress), 0),
    });
    return () => st.kill();
  }, [root]);
}

/** Smoothly scroll the page to a progress value (used by the depth gauge). */
export function scrollToProgress(p: number, instant = false) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: clamp01(p) * max, behavior: instant ? 'auto' : 'smooth' });
}
