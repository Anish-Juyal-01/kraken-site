import { Suspense, lazy, useCallback, useMemo, useRef, useState } from 'react';
import { moodFor } from './kraken/moods';
import { armAngle } from './kraken/armCurve';
import { posesFor, ringFor } from './kraken/poses';
import type { KrakenState } from './kraken/state';
import { armIndexAt, armLocal } from './scroll/stages';
import { useScrollProgress } from './scroll/useScrollProgress';
import { useFlowProgress } from './scroll/useFlowProgress';
import { detectDevice, qualityFor } from './kraken/quality';
import { lookById } from './kraken/looks';
import { Ascent } from './sections/Ascent';
import { Creature, CreatureList } from './sections/Creature';
import { Descent } from './sections/Descent';
import { Floor } from './sections/Floor';
import { Surface, SurfaceBack } from './sections/Surface';
import { Backdrop } from './ui/Backdrop';
import { SurfaceAgain } from './sections/SurfaceAgain';
import { Waterline } from './sections/Waterline';
import { interactions } from './sections/interactions';
import { DepthGauge } from './ui/DepthGauge';
import { Ambience } from './ui/Ambience';
import { WaterBack, WaterFront } from './ui/Water';

// The 3D code is the heavy part: load it after the first screen's text has painted.
const Scene = lazy(() => import('./kraken/Scene'));

const smooth = (t: number) => t * t * (3 - 2 * t);

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const shift = useRef({ x: 0, t: 0 });
  const [device, setDevice] = useState(detectDevice);
  const quality = useMemo(() => qualityFor(device), [device]);
  // ?look=mochi|dumbo|sticker|squid picks the kraken design
  const look = useMemo(() => lookById(new URLSearchParams(location.search).get('look')), []);
  // Reduced motion or no 3D: an ordinary page, no pinning, no scrubbing.
  const flow = quality.mode === 'still' || quality.mode === 'none';
  useScrollProgress(root, !flow);
  useFlowProgress(flow);

  /** Once per frame: turn scroll position and what the visitor did into the kraken's pose. */
  const direct = useCallback((s: KrakenState, p: number, now: number) => {
    const arm = armIndexAt(p);
    const wide = window.innerWidth / window.innerHeight > 0.9;
    const atSurface = p < 0.07;
    const atEnd = p > 0.93; // on the ocean bed, by the submarine
    s.activeArm = arm;
    s.poses = posesFor(arm, arm === null ? 0 : smooth(Math.min(1, armLocal(p) / 0.22)));
    s.ring = ringFor(arm, true); // to the side even on phones: an arm raised in front hides the face
    if (atSurface || atEnd) {
      // peeking over the waterline: one arm is up out of the water, ready to wave
      s.poses[7] = { reach: 0.62, curl: 0.12, lift: 1 };
      s.ring = armAngle(7) - 0.12; // out to the side, clear of the face
    }
    const it = interactions.get();
    s.mood = atSurface ? 'curious' : atEnd ? 'proud' : moodFor(arm, it.storm, it.delivered);
    const idle = (performance.now() - s.lastMove) / 1000;
    const canWave = atSurface || atEnd || arm === 7;
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
      <Ambience />
      <WaterBack />
      {!flow && (
        <Backdrop>
          <SurfaceBack />
        </Backdrop>
      )}
      {quality.mode !== 'none' && (
        <Suspense fallback={null}>
          <Scene quality={quality} look={look} direct={direct} onLost={() => setDevice((d) => ({ ...d, webgl: false }))} />
        </Suspense>
      )}
      <WaterFront />
      <main>
        <Surface flow={flow} />
        <Waterline flow={flow} />
        <Descent flow={flow} />
        {flow ? <CreatureList /> : <Creature />}
        <Floor flow={flow} />
        <Ascent flow={flow} />
        <SurfaceAgain flow={flow} />
      </main>
      {!flow && <DepthGauge />}
    </div>
  );
}
