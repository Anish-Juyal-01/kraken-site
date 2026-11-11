import { useEffect, useMemo, useRef } from 'react';
import { scrollStore } from '../scroll/store';
import { waterTop } from '../kraken/camera';
import { depthColor, depthMix, inkColor } from '../kraken/depth';

/** One seamless wave: crest line plus everything below it, as a single shape, so there is
 *  never a seam between "wave" and "water". Repeats every 1200 units; the layer is 2400 wide
 *  and slides by half its width, which loops perfectly. */
function wavePath(base: number, a1: number, a2: number, phase: number): { fill: string; crest: string } {
  let crest = '';
  for (let x = 0; x <= 2400; x += 12) {
    const y = base + a1 * Math.sin((x / 600) * Math.PI * 2 + phase) + a2 * Math.sin((x / 200) * Math.PI * 2 + phase * 2.3);
    crest += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)} `;
  }
  return { fill: `${crest}L2400 1000 L0 1000 Z`, crest };
}

// Colours are CSS variables written by the palette, so a layer never hard-codes one.
type LayerProps = { id: string; top: string; from: string; to: string; lift: number; seconds: number; reverse?: boolean; a1: number; a2: number; phase: number; foam?: number };

function Layer({ id, top, from, to, lift, seconds, reverse, a1, a2, phase, foam = 0 }: LayerProps) {
  const path = useMemo(() => wavePath(30, a1, a2, phase), [a1, a2, phase]);
  return (
    <svg
      className="wave-drift absolute left-0 h-full w-[200%]"
      style={{ top: `${lift}px`, animationDuration: `${seconds}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      viewBox="0 0 2400 1000"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: `var(${top})` }} />
          <stop offset="0.12" style={{ stopColor: `var(${from})` }} />
          <stop offset="0.75" style={{ stopColor: `var(${to})` }} />
        </linearGradient>
      </defs>
      <path d={path.fill} fill={`url(#${id})`} />
      {foam > 0 && <path d={path.crest} fill="none" className="stroke-paper" strokeOpacity={foam} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

function useSheet(writeColours: boolean) {
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      scrollStore.subscribe((p) => {
        if (writeColours) {
          const root = document.documentElement.style;
          const deep = depthMix(p) > 0.5;
          root.setProperty('--bg-now', depthColor(p));
          root.setProperty('--ink-now', inkColor(p));
          root.setProperty('--card-now', deep ? 'color-mix(in srgb, var(--color-paper) 10%, transparent)' : 'rgba(255, 255, 255, 0.72)');
          root.setProperty('--line-now', deep ? 'color-mix(in srgb, var(--color-paper) 24%, transparent)' : 'color-mix(in srgb, var(--color-ink) 18%, transparent)');
        }
        const el = sheet.current;
        if (!el) return;
        const o = 1 - depthMix(p);
        el.style.transform = `translate3d(0, ${waterTop(p, window.innerWidth / window.innerHeight)}vh, 0)`;
        el.style.opacity = String(o);
        el.style.display = o <= 0.001 ? 'none' : '';
      }),
    [writeColours],
  );
  return sheet;
}

/** The far water, behind the kraken: two rows of distant waves and shafts of light. */
export function WaterBack() {
  const sheet = useSheet(true);
  return (
    <div ref={sheet} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[135vh] overflow-x-clip">
      <Layer id="w-far" top="--w-far-top" from="--w-far" to="--color-deep" lift={-40} seconds={46} a1={7} a2={2.2} phase={0.6} foam={0.55} />
      <Layer id="w-mid" top="--w-mid-top" from="--w-mid" to="--color-deep" lift={-20} seconds={31} reverse a1={8} a2={2.6} phase={2.1} foam={0.35} />
      <div className="light-rays absolute inset-x-0 top-0 h-[70vh]" />
    </div>
  );
}

/** The near water, in front of the kraken: it tints whatever is below the surface. */
export function WaterFront() {
  const sheet = useSheet(false);
  return (
    <div ref={sheet} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-[135vh] overflow-x-clip">
      <Layer id="w-near" top="--w-near-top" from="--w-near" to="--w-near-bottom" lift={0} seconds={22} a1={9} a2={3} phase={4.0} foam={0.7} />
    </div>
  );
}
