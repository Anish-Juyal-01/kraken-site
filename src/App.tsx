import { Suspense, lazy, useCallback, useRef } from 'react';
import { moodFor } from './kraken/moods';
import { posesFor, ringFor } from './kraken/poses';
import type { KrakenState } from './kraken/state';
import { armIndexAt, armLocal } from './scroll/stages';
import { useScrollProgress } from './scroll/useScrollProgress';
import { Ascent } from './sections/Ascent';
import { Creature } from './sections/Creature';
import { Descent } from './sections/Descent';
import { Floor } from './sections/Floor';
import { Surface } from './sections/Surface';
import { SurfaceAgain } from './sections/SurfaceAgain';
import { Waterline } from './sections/Waterline';
import { interactions } from './sections/interactions';
import { DepthGauge } from './ui/DepthGauge';
import { Water } from './ui/Water';

// The 3D code is the heavy part: load it after the first screen's text has painted.
const Scene = lazy(() => import('./kraken/Scene'));

const smooth = (t: number) => t * t * (3 - 2 * t);

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const shift = useRef({ x: 0, t: 0 });
  useScrollProgress(root);

  /** Once per frame: turn scroll position and what the visitor did into the kraken's pose. */
  const direct = useCallback((s: KrakenState, p: number, now: number) => {
    const arm = armIndexAt(p);
    const wide = window.innerWidth / window.innerHeight > 0.9;
    const atSurface = p < 0.07 || p > 0.955;
    s.activeArm = arm;
    s.poses = posesFor(arm, arm === null ? 0 : smooth(Math.min(1, armLocal(p) / 0.22)));
    s.ring = ringFor(arm, wide);
    if (atSurface) {
      // peeking over the waterline: one arm is up out of the water, ready to wave
      s.poses[7] = { reach: 0.62, curl: 0.12, lift: 1 };
      s.ring = ringFor(7, true) + 0.5;
    }
    const it = interactions.get();
    s.mood = atSurface ? 'curious' : moodFor(arm, it.storm, it.delivered);
    const idle = (performance.now() - s.lastMove) / 1000;
    const canWave = atSurface || arm === 7;
    s.wave = canWave && idle > 4 && (idle - 4) % 5 < 1.2 ? 1 : 0;
    // Step aside so the card and the kraken share the screen instead of overlapping.
    const dt = Math.min(1, Math.max(0, now - shift.current.t));
    shift.current.t = now;
    const target = arm === null || !wide ? 0 : arm % 2 === 0 ? -1.5 : 1.5;
    shift.current.x += (target - shift.current.x) * (dt > 0.25 ? 1 : 1 - Math.exp(-dt * 4));
    s.x += shift.current.x;
  }, []);

  return (
    <div ref={root} className="relative">
      <Suspense fallback={null}>
        <Scene direct={direct} />
      </Suspense>
      <Water />
      <main>
        <Surface flow={false} />
        <Waterline flow={false} />
        <Descent flow={false} />
        <Creature />
        <Floor flow={false} />
        <Ascent flow={false} />
        <SurfaceAgain flow={false} />
      </main>
      <DepthGauge />
    </div>
  );
}
