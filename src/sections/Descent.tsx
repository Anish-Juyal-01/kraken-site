import { useCallback, useRef } from 'react';
import { PROBLEM } from '../content/content';
import { Stage } from '../ui/Stage';

/** The fall through the water: the problem, one line at a time. */
export function Descent({ flow }: { flow: boolean }) {
  const lines = useRef<(HTMLParagraphElement | null)[]>([]);
  const onProgress = useCallback((l: number) => {
    lines.current.forEach((el, i) => {
      if (!el) return;
      const o = Math.min(1, Math.max(0, (l - 0.1 - i * 0.2) / 0.14));
      el.style.opacity = String(0.12 + o * 0.88);
      el.style.transform = `translate3d(0, ${(1 - o) * 18}px, 0)`;
    });
  }, []);

  return (
    <Stage id="descent" flow={flow} onProgress={onProgress}>
      <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-center gap-5 px-5 md:px-12">
        {PROBLEM.map((line, i) => (
          <p key={line} ref={(el) => (lines.current[i] = el)} className="display max-w-[22ch] text-[30px] sm:text-4xl md:text-5xl">
            {line}
          </p>
        ))}
      </div>
    </Stage>
  );
}
