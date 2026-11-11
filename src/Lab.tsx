import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Kraken } from './kraken/Kraken';
import { LOOKS, type Look } from './kraken/looks';
import { HERO_DESIGNS } from './sections/heroDesigns';
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

/** ?lab=hero: the first-screen designs, each one the real page in a small frame.
 *  ?lab=mix shows only the mixes of Wordmark and Above-and-below. */
function HeroLab({ mixes }: { mixes: boolean }) {
  const list = HERO_DESIGNS.filter((h) => !!h.mix === mixes);
  return (
    <main className="min-h-[100dvh] bg-[#d9d3c4] px-5 py-8 text-ink md:px-10">
      <h1 className="display text-4xl">{mixes ? 'Wordmark meets Above and below' : 'Four first screens'}</h1>
      <p className="mt-2 max-w-[70ch] text-[16px] leading-relaxed">Each frame is the real page. Click a name to open that design full size.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {list.map((h) => (
          <figure key={h.id}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-paper">
              <iframe title={h.name} src={`./?hero=${h.id}`} className="absolute left-0 top-0 h-[900px] w-[1600px] origin-top-left border-0" style={{ transform: 'scale(var(--fit))' }} ref={fit} />
            </div>
            <figcaption className="mt-3">
              <a className="display text-2xl underline decoration-coral decoration-[3px] underline-offset-4" href={`./?hero=${h.id}`} target="_blank" rel="noreferrer">
                {h.name}
              </a>
              <p className="mt-1 max-w-[52ch] text-[14.5px] leading-relaxed opacity-85">{h.blurb}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}

/** Scale a 1600x900 frame down to its box. */
function fit(el: HTMLIFrameElement | null) {
  if (!el?.parentElement) return;
  const set = () => el.style.setProperty('--fit', String(el.parentElement!.clientWidth / 1600));
  set();
  new ResizeObserver(set).observe(el.parentElement);
}

/** Four kraken designs side by side, so one can be picked. Open with ?lab in the address. */
export default function Lab() {
  const which = new URLSearchParams(location.search).get('lab');
  if (which === 'hero' || which === 'mix') return <HeroLab mixes={which === 'mix'} />;
  return <KrakenLab />;
}

function KrakenLab() {
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
