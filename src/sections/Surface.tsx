import { HERO, LINKS } from '../content/content';
import { setHeroStage } from '../kraken/camera';
import { progressOfArm } from '../scroll/stages';
import { scrollToProgress } from '../scroll/useScrollProgress';
import { Button } from '../ui/Button';
import { Stage } from '../ui/Stage';
import {
  DepthsBack,
  DepthsFront,
  MirrorBack,
  MirrorFront,
  PosterBack,
  PosterFront,
  SplitFront,
  SunkBack,
  SunkFront,
  VoyageBack,
  VoyageFront,
  WordmarkBack,
  WordmarkFront,
  heroById,
} from './heroDesigns';

// ?hero=wordmark|split|poster|voyage|sunk|mirror|depths picks the first-screen design.
export const HERO_DESIGN = heroById(new URLSearchParams(location.search).get('hero'));
setHeroStage(HERO_DESIGN.stage); // where the waterline rests and the kraken waits, before the first frame

const NAV = [
  { label: 'How it works', p: progressOfArm(0) },
  { label: 'Built on Switch', p: 0.79 },
  { label: 'Run it', p: 1 },
];

/** The part of the chosen design that sits behind the kraken (giant type, sun, boat). */
export function SurfaceBack() {
  if (HERO_DESIGN.id === 'wordmark') return <WordmarkBack />;
  if (HERO_DESIGN.id === 'poster') return <PosterBack />;
  if (HERO_DESIGN.id === 'voyage') return <VoyageBack />;
  if (HERO_DESIGN.id === 'sunk') return <SunkBack />;
  if (HERO_DESIGN.id === 'mirror') return <MirrorBack />;
  if (HERO_DESIGN.id === 'depths') return <DepthsBack />;
  return null;
}

function Front() {
  if (HERO_DESIGN.id === 'wordmark') return <WordmarkFront />;
  if (HERO_DESIGN.id === 'split') return <SplitFront />;
  if (HERO_DESIGN.id === 'poster') return <PosterFront />;
  if (HERO_DESIGN.id === 'sunk') return <SunkFront />;
  if (HERO_DESIGN.id === 'mirror') return <MirrorFront />;
  if (HERO_DESIGN.id === 'depths') return <DepthsFront />;
  return <VoyageFront />;
}

/** Phones get one simple centred layout whatever the desktop design is. */
function Compact() {
  return (
    <div className="flex flex-col items-center px-5 pt-[3vh] text-center">
      <h1 className="display text-[36px] sm:text-5xl">{HERO.headline}</h1>
      <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed">{HERO.sub}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button href={LINKS.demo}>Watch the demo</Button>
        <Button href={LINKS.repo} variant="line">
          View on GitHub
        </Button>
      </div>
    </div>
  );
}

/** First screen. */
export function Surface({ flow }: { flow: boolean }) {
  return (
    <Stage id="surface" fadeIn={false} flow={flow}>
      <header className="relative z-[1] mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-12">
        <p className="display text-[22px]">Kraken</p>
        {!flow && (
          <nav aria-label="Sections" className="hidden items-center gap-7 text-[15px] font-medium md:flex">
            {NAV.map((n) => (
              <button key={n.label} type="button" className="underline-offset-4 hover:underline" onClick={() => scrollToProgress(n.p)}>
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>
      {flow ? (
        <Compact />
      ) : (
        <>
          <div className="hidden md:block">
            <Front />
          </div>
          <div className="md:hidden">
            <Compact />
          </div>
        </>
      )}
    </Stage>
  );
}
