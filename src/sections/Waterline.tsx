import { useCallback, useRef } from 'react';
import { REQUEST } from '../content/content';
import { Stage } from '../ui/Stage';

/** Someone asks for a feature in chat. The message is typed, then sinks below the surface. */
export function Waterline({ flow }: { flow: boolean }) {
  const text = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const onProgress = useCallback((l: number) => {
    const typed = Math.min(1, l / 0.45);
    if (text.current) text.current.textContent = REQUEST.slice(0, Math.round(typed * REQUEST.length));
    const sink = Math.max(0, (l - 0.5) / 0.5);
    if (card.current) card.current.style.transform = `translate3d(0, ${sink * 26}vh, 0) rotate(${sink * -3}deg)`;
  }, []);

  return (
    <Stage id="waterline" flow={flow} onProgress={onProgress}>
      <div className="mx-auto flex h-full max-w-[1400px] items-start px-5 pt-[16vh] md:px-12 md:pt-[20vh]">
        <div ref={card} className="w-full max-w-[560px] rounded-[var(--radius-card)] border border-[var(--line-now)] bg-[var(--card-now)] p-5">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-7 place-items-center rounded-full border-[1.5px] border-[var(--ink-now)] text-[13px] font-bold">
              A
            </span>
            <span className="text-[14px] font-semibold">anish_2007</span>
            <span className="text-[13px] opacity-70">in #kraken-requests</span>
          </div>
          <p className="mt-3 min-h-[4.5em] font-mono text-[15px] leading-relaxed" aria-label={REQUEST}>
            <span ref={text}>{flow ? REQUEST : ''}</span>
            <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-coral" />
          </p>
        </div>
      </div>
    </Stage>
  );
}
