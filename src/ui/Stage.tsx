import { useEffect, useRef } from 'react';
import { scrollStore } from '../scroll/store';
import { localProgress, type SectionId } from '../scroll/stages';
import { FLOW_PROGRESS, sectionHeight } from '../scroll/layout';

type Props = {
  id: SectionId;
  children: React.ReactNode;
  className?: string;
  fadeIn?: boolean;
  fadeOut?: boolean;
  flow?: boolean; // reduced motion: a normal block, no pinning
  onProgress?: (local: number) => void;
};

/** One page section: a tall block whose content stays pinned while you scroll through it,
 *  fading in at its start and out at its end. */
export function Stage({ id, children, className = '', fadeIn = true, fadeOut = true, flow = false, onProgress }: Props) {
  const inner = useRef<HTMLDivElement>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    if (flow) return;
    return scrollStore.subscribe((p) => {
      const l = localProgress(p, id);
      const el = inner.current;
      if (!el) return;
      const a = fadeIn ? Math.min(1, l / 0.12) : 1;
      const b = fadeOut ? Math.min(1, (1 - l) / 0.12) : 1;
      const o = Math.min(a, b);
      el.style.opacity = String(o);
      el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      // display:none, not just hidden: an off-stage panel must not keep any layer on screen
      el.style.display = o <= 0 ? 'none' : '';
      el.style.visibility = 'visible';
      cb.current?.(l);
    });
  }, [id, fadeIn, fadeOut, flow]);

  if (flow)
    return (
      <section id={id} data-section={id} data-progress={FLOW_PROGRESS[id]} className={`relative z-[2] min-h-[100dvh] ${className}`}>
        {children}
      </section>
    );
  return (
    <section id={id} data-section={id} className="relative z-[2]" style={{ height: sectionHeight(id) }}>
      {/* Fixed, not sticky: a section shorter than the screen could never pin. The section's
          height only supplies scroll distance; visibility comes from scroll progress. */}
      <div ref={inner} className={`fixed inset-0 overflow-hidden ${className}`} style={{ visibility: 'hidden' }}>
        {children}
      </div>
    </section>
  );
}
