import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Kraken } from './kraken/Kraken';
import { LOOKS, type Look } from './kraken/looks';
import type { MoodId } from './kraken/moods';
import { posesFor, ringFor } from './kraken/poses';
import { FULL } from './kraken/quality';
import { initialState, type KrakenState } from './kraken/state';

const MOODS: MoodId[] = ['neutral', 'curious', 'concentrating', 'startled', 'relieved', 'proud'];

function Pose({ state, mood, reach }: { state: KrakenState; mood: MoodId; reach: boolean }) {
  useFrame(() => {
    state.mood = mood;
    state.y = -0.3; // room above for the taller heads
    state.activeArm = reach ? 0 : null;
    state.poses = posesFor(reach ? 0 : null, 1);
    state.ring = ringFor(reach ? 0 : null, true);
  });
  return null;
}

function Tile({ look, mood, reach, deep }: { look: Look; mood: MoodId; reach: boolean; deep: boolean }) {
  const state = useMemo(() => initialState(), []);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      state.look = [(e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)];
      state.lean = state.look;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [state]);
  return (
    <figure className={`relative overflow-hidden rounded-[var(--radius-card)] ${deep ? 'bg-deep text-paper' : 'bg-[#f6f2e8] text-ink'}`}>
      <div className="h-[38vh] min-h-[280px]">
        <Canvas dpr={[1, 2]} camera={{ fov: 30, position: [0, 0.2, 6.2] }} gl={{ antialias: true, alpha: true }} resize={{ debounce: 0, scroll: false }}>
          <hemisphereLight args={['#fff1e0', '#2f7a6c', 1.5]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[-3.5, 5, 6]} intensity={2.0} />
          <Pose state={state} mood={mood} reach={reach} />
          <Kraken look={look} state={state} quality={FULL} />
        </Canvas>
      </div>
      <figcaption className="px-5 pb-5">
        <p className="display text-2xl">{look.name}</p>
        <p className="mt-1 max-w-[46ch] text-[14.5px] leading-relaxed opacity-85">{look.blurb}</p>
      </figcaption>
    </figure>
  );
}

/** Four kraken designs side by side, so one can be picked. Open with ?lab in the address. */
export default function Lab() {
  const [mood, setMood] = useState<MoodId>('neutral');
  const [reach, setReach] = useState(false);
  const [deep, setDeep] = useState(false);
  const chip = (on: boolean) =>
    `rounded-full border-[1.5px] border-ink px-3.5 py-1.5 text-[13.5px] font-semibold ${on ? 'bg-ink text-paper' : 'text-ink'}`;
  return (
    <main className="min-h-[100dvh] bg-paper px-5 py-8 text-ink md:px-10">
      <h1 className="display text-4xl">Four krakens</h1>
      <p className="mt-2 max-w-[70ch] text-[16px] leading-relaxed">
        Same creature, same behaviour, four different designs. Move the cursor: the eyes follow. Try the moods to see how each face reacts.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {MOODS.map((m) => (
          <button key={m} type="button" className={chip(mood === m)} onClick={() => setMood(m)}>
            {m}
          </button>
        ))}
        <span className="mx-2 h-6 w-px bg-ink/30" />
        <button type="button" className={chip(reach)} onClick={() => setReach((v) => !v)}>
          arm out
        </button>
        <button type="button" className={chip(deep)} onClick={() => setDeep((v) => !v)}>
          deep water
        </button>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {LOOKS.map((look) => (
          <Tile key={look.id} look={look} mood={mood} reach={reach} deep={deep} />
        ))}
      </div>
    </main>
  );
}
