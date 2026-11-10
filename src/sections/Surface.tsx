import { HERO, LINKS } from '../content/content';
import { progressOfArm } from '../scroll/stages';
import { scrollToProgress } from '../scroll/useScrollProgress';
import { Button } from '../ui/Button';
import { Stage } from '../ui/Stage';

// Real disagreements from Kraken's demo: the kind of thing Sonar catches.
const BUOYS = [
  { where: '#backend', text: 'user_id is a UUID string', cls: 'left-[2%] buoy-a', tilt: -4 },
  { where: '#mobile', text: 'we parse user_id as an int', cls: 'left-[18%] buoy-b hidden xl:block', tilt: 3 },
  { where: '#product', text: 'free tier: 100 requests a day', cls: 'right-[16%] buoy-c hidden xl:block', tilt: -2 },
  { where: 'limits.yaml', text: 'requests_per_day: 1000', cls: 'right-[1.5%] buoy-b', tilt: 4 },
];

const NAV = [
  { label: 'How it works', p: progressOfArm(0) },
  { label: 'Built on Switch', p: 0.79 },
  { label: 'Run it', p: 1 },
];

/** First screen: the team's chat floats on the surface, and something below is listening. */
export function Surface({ flow }: { flow: boolean }) {
  return (
    <Stage id="surface" fadeIn={false} flow={flow}>
      <header className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-12">
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

      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 pt-[3vh] text-center md:px-12 md:pt-[4vh]">
        <h1 className="display" style={{ fontSize: 'clamp(34px, min(7.6vh, 5.4vw), 80px)' }}>
          {HERO.headline.split('. ').map((part, i, all) => (
            <span key={part} className="block">
              {part}
              {i < all.length - 1 ? '.' : ''}
            </span>
          ))}
        </h1>
        <p className="mt-[2.2vh] max-w-[46ch] text-[16px] leading-relaxed md:text-[18px]">{HERO.sub}</p>
        <div className="mt-[2.6vh] flex flex-wrap justify-center gap-3">
          <Button href={LINKS.demo}>Watch the demo</Button>
          <Button href={LINKS.repo} variant="line">
            View on GitHub
          </Button>
        </div>
      </div>

      {/* The team's chat, bobbing on the surface. Each line contradicts another one. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[68vh] hidden md:block">
        {BUOYS.map((b) => (
          <div key={b.where} className={`buoy absolute -top-[58px] ${b.cls}`}>
            <div
              className="rounded-[var(--radius-card)] border border-[rgba(18,51,45,0.2)] bg-[#fbf9f3] px-4 py-3 text-left text-ink shadow-[0_10px_24px_-12px_rgba(11,36,32,0.55)]"
              style={{ transform: `rotate(${b.tilt}deg)` }}
            >
              <p className="text-[12.5px] font-semibold text-coral">{b.where}</p>
              <p className="mt-0.5 whitespace-nowrap font-mono text-[13.5px]">{b.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
}
