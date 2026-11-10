import { useEffect, useRef, useState } from 'react';
import { ARMS } from '../content/content';
import { scrollStore } from '../scroll/store';
import { progressOfArm } from '../scroll/stages';
import { scrollToProgress } from '../scroll/useScrollProgress';

const MARKS = [
  { label: 'Surface', p: 0 },
  { label: 'Descent', p: 0.2 },
  ...ARMS.map((a, i) => ({ label: a.name, p: progressOfArm(i) })),
  { label: 'Sea floor', p: 0.79 },
  { label: 'Run it', p: 1 },
];

/** Position 0..1 along the gauge: marks are evenly spaced, progress is interpolated between. */
function gaugeAt(p: number): { t: number; label: string } {
  let i = 0;
  while (i < MARKS.length - 2 && p > MARKS[i + 1].p) i++;
  const a = MARKS[i];
  const b = MARKS[i + 1];
  const f = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
  return { t: (i + f) / (MARKS.length - 1), label: f < 0.5 ? a.label : b.label };
}

/** The depth gauge: shows where you are, and each mark jumps there. Hidden on phones. */
export function DepthGauge() {
  const pointer = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('Surface');
  useEffect(
    () =>
      scrollStore.subscribe((p) => {
        const g = gaugeAt(p);
        if (pointer.current) pointer.current.style.transform = `translate3d(0, ${g.t * 100}%, 0)`;
        setLabel((old) => (old === g.label ? old : g.label));
      }),
    [],
  );
  return (
    <nav aria-label="Depth" className="fixed right-5 top-1/2 z-[3] hidden h-[62vh] -translate-y-1/2 md:block">
      <div className="absolute right-[11px] top-0 h-full w-px bg-[var(--line-now)]" />
      <div ref={pointer} className="pointer-events-none absolute right-0 top-0 h-full">
        <div className="absolute right-[5px] top-0 size-[13px] -translate-y-1/2 rounded-full bg-coral" />
        <div className="absolute right-8 top-0 -translate-y-1/2 whitespace-nowrap text-[13px] font-semibold">{label}</div>
      </div>
      {MARKS.map((m, i) => (
        <button
          key={m.label}
          type="button"
          aria-label={`Go to ${m.label}`}
          title={m.label}
          onClick={() => scrollToProgress(m.p)}
          className="group absolute right-0 grid size-6 -translate-y-1/2 place-items-center"
          style={{ top: `${(i / (MARKS.length - 1)) * 100}%` }}
        >
          <span className="h-[1.5px] w-2.5 bg-[var(--ink-now)] opacity-50 transition-transform group-hover:scale-x-150 group-hover:opacity-100" />
        </button>
      ))}
    </nav>
  );
}
