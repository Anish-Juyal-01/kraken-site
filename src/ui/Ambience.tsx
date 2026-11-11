import { useEffect, useRef } from 'react';
import { scrollStore } from '../scroll/store';
import { depthMix } from '../kraken/depth';
import { localProgress } from '../scroll/stages';
import { BubbleColumn, Jelly, Reef, Shoal, Whale } from './SeaLife';

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Everything that makes the deep feel like a place: a gradient instead of a flat colour,
 *  shafts of light, a whale, shoals, jellyfish, and a sea floor with a reef that rises when you
 *  reach the bottom. */
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
          const up = smooth(Math.min(1, localProgress(p, 'floor') / 0.3)); // rises once, stays to the end
          floor.current.style.transform = `translate3d(0, ${(1 - up) * 105}%, 0)`;
        }
      }),
    [],
  );
  return (
    <div ref={layer} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ opacity: 0 }}>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% -10%, var(--sea-0) 0%, var(--sea-1) 38%, var(--sea-2) 72%, var(--sea-3) 100%)' }}
      />
      <div className="light-rays absolute inset-x-0 top-0 h-[85vh] opacity-80" />
      <Whale top="12%" seconds={150} delay={-40} />
      <div className="absolute inset-0">
        <Shoal top="18%" seconds={64} delay={-12} scale={1} />
        <Shoal top="62%" seconds={88} delay={-50} scale={0.7} reverse color="var(--pop)" />
        <Shoal top="38%" seconds={110} delay={-80} scale={0.5} color="var(--color-paper)" />
        <Shoal top="80%" seconds={76} delay={-30} scale={0.6} />
      </div>
      <Jelly left="7%" top="44%" size={64} seconds={26} delay={-4} color="var(--reef-1)" />
      <Jelly left="86%" top="58%" size={46} seconds={32} delay={-18} color="var(--pop)" />
      <Jelly left="62%" top="24%" size={34} seconds={38} delay={-9} color="var(--color-paper)" />
      <div ref={floor} className="absolute inset-x-0 bottom-0 h-[22vh]">
        <svg className="absolute inset-0 size-full" viewBox="0 0 1600 340" preserveAspectRatio="none">
          <path d="M0 150 C 180 96, 320 180, 520 138 S 900 86, 1120 150 S 1440 104, 1600 142 V340 H0 Z" fill="var(--bed-1)" />
          <path d="M0 214 C 220 170, 420 244, 700 204 S 1180 164, 1600 220 V340 H0 Z" fill="var(--bed-2)" />
        </svg>
        <svg className="absolute bottom-0 left-[4%] h-[30vh] w-[22vh]" viewBox="0 0 220 300" fill="none" stroke="var(--kelp-1)" strokeWidth="13" strokeLinecap="round">
          <path className="kelp" d="M40 300 C 20 230, 62 190, 40 120 S 54 40, 38 12" />
          <path className="kelp kelp-b" d="M96 300 C 120 240, 78 200, 100 140 S 86 80, 104 44" />
          <path className="kelp" d="M160 300 C 140 250, 178 220, 158 170 S 170 120, 156 92" />
        </svg>
        <svg className="absolute bottom-0 right-[30%] h-[20vh] w-[16vh]" viewBox="0 0 160 200" fill="none" stroke="var(--kelp-2)" strokeWidth="11" strokeLinecap="round">
          <path className="kelp kelp-b" d="M40 200 C 22 150, 60 120, 42 70 S 52 30, 40 12" />
          <path className="kelp" d="M104 200 C 124 160, 88 130, 106 90 S 96 56, 108 36" />
        </svg>
        <svg className="absolute bottom-0 right-[6%] h-[26vh] w-[14vh]" viewBox="0 0 160 200" fill="none" stroke="var(--kelp-1)" strokeWidth="11" strokeLinecap="round">
          <path className="kelp" d="M50 200 C 30 150, 70 120, 50 60 S 62 26, 48 8" />
          <path className="kelp kelp-b" d="M110 200 C 128 164, 96 136, 112 96" />
        </svg>
        <svg className="absolute bottom-[1vh] left-[30%] h-[9vh] w-[30vh]" viewBox="0 0 300 90" fill="var(--rock)">
          <ellipse cx="70" cy="62" rx="68" ry="30" />
          <ellipse cx="170" cy="56" rx="56" ry="36" />
          <ellipse cx="246" cy="68" rx="48" ry="22" />
        </svg>
        <Reef />
        <BubbleColumn left="18%" />
        <BubbleColumn left="54%" delay={-2.2} />
        <BubbleColumn left="91%" delay={-3.4} />
      </div>
    </div>
  );
}
