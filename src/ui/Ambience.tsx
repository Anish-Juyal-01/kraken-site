import { useEffect, useRef } from 'react';
import { scrollStore } from '../scroll/store';
import { depthMix } from '../kraken/depth';
import { localProgress } from '../scroll/stages';

const smooth = (t: number) => t * t * (3 - 2 * t);

function Fish({ x, y, s, flip }: { x: number; y: number; s: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C 8 -9, 26 -9, 36 0 C 26 9, 8 9, 0 0 Z M36 0 L48 -8 L46 0 L48 8 Z" />
    </g>
  );
}

/** A loose shoal that drifts across the screen. */
function Shoal({ top, seconds, delay, scale, reverse }: { top: string; seconds: number; delay: number; scale: number; reverse?: boolean }) {
  const fish = [
    [0, 20, 1],
    [58, 4, 0.8],
    [70, 40, 0.9],
    [128, 22, 1.1],
    [150, 56, 0.7],
    [196, 8, 0.85],
    [214, 40, 1],
    [262, 26, 0.75],
  ];
  return (
    <div
      className={`shoal absolute ${reverse ? 'shoal-back' : ''}`}
      style={{ top, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}
    >
      <svg width={330 * scale} height={80 * scale} viewBox="0 0 330 80" fill="currentColor">
        {fish.map(([x, y, s], i) => (
          <Fish key={i} x={reverse ? x + 48 : x} y={y + 10} s={s} flip={reverse} />
        ))}
      </svg>
    </div>
  );
}

/** Everything that makes the deep feel like a place: a gradient instead of a flat colour,
 *  shafts of light, passing fish, and a sea floor that rises when you reach the bottom. */
export function Ambience() {
  const layer = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      scrollStore.subscribe((p) => {
        const d = depthMix(p);
        if (layer.current) {
          layer.current.style.opacity = String(d);
          layer.current.style.display = d <= 0.001 ? 'none' : '';
        }
        if (floor.current) {
          const up = smooth(Math.min(1, localProgress(p, 'floor') / 0.3)) * (1 - smooth(Math.max(0, (localProgress(p, 'ascent') - 0.1) / 0.6)));
          floor.current.style.transform = `translate3d(0, ${(1 - up) * 105}%, 0)`;
        }
      }),
    [],
  );
  return (
    <div ref={layer} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#1c5247_0%,#0f342d_38%,#0b2420_72%,#071a17_100%)]" />
      <div className="light-rays absolute inset-x-0 top-0 h-[85vh] opacity-70" />
      <div className="absolute inset-0 text-[#2c6b5e]">
        <Shoal top="18%" seconds={64} delay={-12} scale={1} />
        <Shoal top="62%" seconds={88} delay={-50} scale={0.7} reverse />
        <Shoal top="38%" seconds={110} delay={-80} scale={0.5} />
      </div>
      <div ref={floor} className="absolute inset-x-0 bottom-0 h-[22vh]">
        <svg className="absolute inset-0 size-full" viewBox="0 0 1600 340" preserveAspectRatio="none">
          <path d="M0 150 C 180 96, 320 180, 520 138 S 900 86, 1120 150 S 1440 104, 1600 142 V340 H0 Z" fill="#123a32" />
          <path d="M0 214 C 220 170, 420 244, 700 204 S 1180 164, 1600 220 V340 H0 Z" fill="#0d2d27" />
        </svg>
        <svg className="absolute bottom-0 left-[4%] h-[30vh] w-[22vh]" viewBox="0 0 220 300" fill="none" stroke="#1d5a4e" strokeWidth="13" strokeLinecap="round">
          <path className="kelp" d="M40 300 C 20 230, 62 190, 40 120 S 54 40, 38 12" />
          <path className="kelp kelp-b" d="M96 300 C 120 240, 78 200, 100 140 S 86 80, 104 44" />
          <path className="kelp" d="M160 300 C 140 250, 178 220, 158 170 S 170 120, 156 92" />
        </svg>
        <svg className="absolute bottom-0 right-[30%] h-[20vh] w-[16vh]" viewBox="0 0 160 200" fill="none" stroke="#184c42" strokeWidth="11" strokeLinecap="round">
          <path className="kelp kelp-b" d="M40 200 C 22 150, 60 120, 42 70 S 52 30, 40 12" />
          <path className="kelp" d="M104 200 C 124 160, 88 130, 106 90 S 96 56, 108 36" />
        </svg>
        <svg className="absolute bottom-[1vh] left-[30%] h-[9vh] w-[30vh]" viewBox="0 0 300 90" fill="#1a4a40">
          <ellipse cx="70" cy="62" rx="68" ry="30" />
          <ellipse cx="170" cy="56" rx="56" ry="36" />
          <ellipse cx="246" cy="68" rx="48" ry="22" />
        </svg>
      </div>
    </div>
  );
}
