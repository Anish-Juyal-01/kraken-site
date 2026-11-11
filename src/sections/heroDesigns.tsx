import { HERO, LINKS } from '../content/content';
import type { HeroStage } from '../kraken/camera';
import { Button } from '../ui/Button';

export type HeroId = 'wordmark' | 'split' | 'poster' | 'voyage' | 'sunk' | 'mirror' | 'depths';

export const HERO_DESIGNS: { id: HeroId; name: string; blurb: string; stage: HeroStage; mix?: boolean }[] = [
  { id: 'wordmark', name: 'Wordmark', blurb: 'A giant KRAKEN half sunk in the sea, with the creature peeking through the letters.', stage: { water: 66, x: 0.15, dy: 0, scale: 1 } },
  { id: 'split', name: 'Above and below', blurb: 'The waterline cuts the screen in two: the team talks above, the kraken listens below.', stage: { water: 47, x: 1.75, dy: -1.25, scale: 1.05 } },
  { id: 'poster', name: 'Poster', blurb: 'Huge type that runs down into the water, so the second sentence is literally below the surface.', stage: { water: 60, x: 2.3, dy: 0.02, scale: 1.1 } },
  // mixes of Wordmark and Above-and-below
  { id: 'sunk', mix: true, name: 'Sunk wordmark', blurb: 'The waterline splits the screen and the giant KRAKEN straddles it: two thirds in the air, one third under. The second sentence waits below.', stage: { water: 50, x: 2.05, dy: 0, scale: 1 } },
  { id: 'mirror', mix: true, name: 'Mirror', blurb: 'KRAKEN stands on the water and its reflection hangs below, where the second sentence and the kraken are.', stage: { water: 52, x: 0.1, dy: -0.02, scale: 0.95 } },
  { id: 'depths', mix: true, name: 'Name in the depths', blurb: 'Above: the team and its chat. Below: the name itself, huge and pale under the water, with the kraken in front of it.', stage: { water: 42, x: 1.9, dy: -1.3, scale: 1.05 } },
  { id: 'voyage', name: 'Voyage', blurb: 'A small scene: a low sun, a boat carrying the team chat, and the kraken rising under it.', stage: { water: 55, x: 1.2, dy: -0.05, scale: 1.05 } },
];

export const heroById = (id: string | null | undefined) => HERO_DESIGNS.find((h) => h.id === id) ?? HERO_DESIGNS[0];

const [LINE1, LINE2] = HERO.headline.split('. ').map((part, i, all) => (i < all.length - 1 ? `${part}.` : part));

function Cta({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button href={LINKS.demo}>Watch the demo</Button>
      <Button href={LINKS.repo} variant="line">
        View on GitHub
      </Button>
    </div>
  );
}

type Chat = { where: string; text: string };
const CHAT: Chat[] = [
  { where: '#backend', text: 'user_id is a UUID string' },
  { where: '#mobile', text: 'we parse user_id as an int' },
  { where: '#product', text: 'free tier: 100 requests a day' },
  { where: 'limits.yaml', text: 'requests_per_day: 1000' },
];

function ChatChip({ chat, className = '', tilt = 0 }: { chat: Chat; className?: string; tilt?: number }) {
  return (
    <div className={`buoy absolute ${className}`}>
      <div
        className="rounded-[var(--radius-card)] border border-[rgba(18,51,45,0.2)] bg-[#fbf9f3] px-4 py-3 text-left text-ink shadow-[0_10px_24px_-12px_rgba(11,36,32,0.55)]"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <p className="text-[12.5px] font-semibold text-coral">{chat.where}</p>
        <p className="mt-0.5 whitespace-nowrap font-mono text-[13.5px]">{chat.text}</p>
      </div>
    </div>
  );
}

/* ---------- 1. Wordmark ---------- */

export function WordmarkBack() {
  return (
    <p
      className="display absolute inset-x-0 text-center leading-none text-ink"
      style={{ top: '66vh', fontSize: '25.5vw', transform: 'translateY(-70%)', letterSpacing: '-0.045em' }}
    >
      KRAKEN
    </p>
  );
}

export function WordmarkFront() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col items-center px-12 pt-[2.5vh] text-center">
      <h1 className="display" style={{ fontSize: 'clamp(26px, min(4.6vh, 3vw), 46px)' }}>
        {LINE1} {LINE2}
      </h1>
      <p className="mt-[1.4vh] max-w-[52ch] text-[17px] leading-relaxed">{HERO.sub}</p>
      <Cta className="mt-[2vh] justify-center" />
    </div>
  );
}

/* ---------- 2. Above and below ---------- */

export function SplitFront() {
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-12 pt-[4vh]">
        <h1 className="display max-w-[14ch]" style={{ fontSize: 'clamp(40px, min(9.4vh, 6.4vw), 104px)' }}>
          {LINE1}
        </h1>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[47vh] hidden md:block">
        <ChatChip chat={CHAT[0]} className="right-[30%] -top-[62px] buoy-a" tilt={-3} />
        <ChatChip chat={CHAT[1]} className="right-[9%] -top-[70px] buoy-b" tilt={4} />
        <ChatChip chat={CHAT[3]} className="right-[19%] -top-[150px] buoy-c hidden xl:block" tilt={-2} />
      </div>
      <div className="absolute inset-x-0 top-[55vh] mx-auto max-w-[1400px] px-12 text-paper">
        <p className="display max-w-[13ch]" style={{ fontSize: 'clamp(40px, min(9.4vh, 6.4vw), 104px)' }}>
          {LINE2}
        </p>
        <p className="mt-[2vh] max-w-[44ch] text-[18px] leading-relaxed">{HERO.sub}</p>
        <div className="mt-[2.4vh] flex flex-wrap gap-3">
          <Button href={LINKS.demo}>Watch the demo</Button>
          <a
            className="inline-flex h-12 items-center rounded-full border-[1.5px] border-paper px-6 text-[15px] font-semibold text-paper transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            href={LINKS.repo}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </>
  );
}

/* ---------- 3. Poster ---------- */

export function PosterBack() {
  const words = ['Your team', 'decides in chat.', 'Something below', 'is listening.'];
  return (
    <div className="absolute left-[3.4vw] top-[9.5vh] text-ink" style={{ fontSize: 'min(11.6vw, 21.5vh)' }}>
      {words.map((w) => (
        <p key={w} className="display whitespace-nowrap leading-[0.92]" style={{ letterSpacing: '-0.04em' }}>
          {w}
        </p>
      ))}
    </div>
  );
}

export function PosterFront() {
  return (
    <>
      <h1 className="sr-only">{HERO.headline}</h1>
      <div className="absolute right-[8.5vw] top-[10vh] w-[min(330px,24vw)] text-right">
        <p className="text-[17px] leading-relaxed">{HERO.sub}</p>
        <Cta className="mt-[2.2vh] justify-end" />
      </div>
    </>
  );
}

/* ---------- 4. Voyage ---------- */

export function VoyageBack() {
  return (
    <>
      {/* a low sun on the horizon */}
      <div className="absolute left-[58%] top-[55vh] aspect-square w-[34vw] -translate-x-1/2 -translate-y-[58%] rounded-full bg-[#f4b9a3]" />
      <div className="absolute left-[58%] top-[55vh] aspect-square w-[46vw] -translate-x-1/2 -translate-y-[56%] rounded-full border-[1.5px] border-[#f4b9a3] opacity-70" />
      {/* a small boat carrying the conversation */}
      <div className="buoy buoy-c absolute left-[15%] top-[55vh] -translate-y-[92%]">
        <svg width="210" height="190" viewBox="0 0 210 190" fill="none">
          <path d="M100 12 V140" stroke="#12332d" strokeWidth="5" strokeLinecap="round" />
          <path d="M106 20 L176 122 H106 Z" fill="#fbf9f3" stroke="#12332d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M94 34 L42 122 H94 Z" fill="#e8553d" stroke="#12332d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M22 140 H190 C 182 168, 160 180, 138 180 H74 C 50 180, 30 168, 22 140 Z" fill="#12332d" />
        </svg>
      </div>
    </>
  );
}

export function VoyageFront() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[55vh] hidden md:block">
        <ChatChip chat={CHAT[0]} className="left-[27%] -top-[150px] buoy-a" tilt={-3} />
        <ChatChip chat={CHAT[1]} className="left-[33%] -top-[82px] buoy-b" tilt={3} />
      </div>
      <div className="mx-auto max-w-[1400px] px-12 pt-[3.5vh]">
        <h1 className="display max-w-[15ch]" style={{ fontSize: 'clamp(38px, min(8vh, 5.4vw), 88px)' }}>
          {LINE1}
        </h1>
      </div>
      <div className="absolute inset-x-0 top-[66vh] mx-auto flex max-w-[1400px] items-end justify-between gap-10 px-12 text-paper">
        <p className="display max-w-[12ch]" style={{ fontSize: 'clamp(38px, min(8vh, 5.4vw), 88px)' }}>
          {LINE2}
        </p>
        <div className="max-w-[40ch] pb-2">
          <p className="text-[17px] leading-relaxed">{HERO.sub}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={LINKS.demo}>Watch the demo</Button>
            <a
              className="inline-flex h-12 items-center rounded-full border-[1.5px] border-paper px-6 text-[15px] font-semibold text-paper transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              href={LINKS.repo}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- mixes of Wordmark and Above-and-below ---------- */

const GHOST =
  'inline-flex h-12 items-center rounded-full border-[1.5px] border-paper px-6 text-[15px] font-semibold text-paper transition-transform hover:-translate-y-0.5 active:scale-[0.98]';

function Below({ top, big = true, align = 'left' }: { top: string; big?: boolean; align?: 'left' | 'center' }) {
  const centre = align === 'center';
  return (
    <div className={`absolute inset-x-0 mx-auto max-w-[1400px] px-12 text-paper ${centre ? 'flex flex-col items-center text-center' : ''}`} style={{ top }}>
      <p className={`display ${centre ? '' : 'max-w-[13ch]'}`} style={{ fontSize: big ? 'clamp(36px, min(7.6vh, 5.2vw), 84px)' : 'clamp(28px, min(5.2vh, 3.6vw), 56px)' }}>
        {LINE2}
      </p>
      <p className="mt-[1.6vh] max-w-[44ch] text-[17px] leading-relaxed">{HERO.sub}</p>
      <div className={`mt-[2vh] flex flex-wrap gap-3 ${centre ? 'justify-center' : ''}`}>
        <Button href={LINKS.demo}>Watch the demo</Button>
        <a className={GHOST} href={LINKS.repo} target="_blank" rel="noreferrer">
          View on GitHub
        </a>
      </div>
    </div>
  );
}

/* 5. Sunk wordmark: the word straddles a half-way waterline */
export function SunkBack() {
  return (
    <p className="display absolute inset-x-0 text-center leading-none text-ink" style={{ top: '50vh', fontSize: '25.5vw', transform: 'translateY(-64%)', letterSpacing: '-0.045em' }}>
      KRAKEN
    </p>
  );
}
export function SunkFront() {
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-12 pt-[1.5vh]">
        <h1 className="display" style={{ fontSize: 'clamp(30px, min(6vh, 3.9vw), 62px)' }}>
          {LINE1}
        </h1>
      </div>
      <Below top="66vh" big={false} />
    </>
  );
}

/* 6. Mirror: the word stands on the water, its reflection hangs below */
export function MirrorBack() {
  const word = { fontSize: '22vw', letterSpacing: '-0.045em' } as const;
  return (
    <>
      <p className="display absolute inset-x-0 text-center leading-none text-ink" style={{ ...word, top: '52vh', transform: 'translateY(-84%)' }}>
        KRAKEN
      </p>
      <p className="display absolute inset-x-0 text-center leading-none text-ink opacity-45" style={{ ...word, top: '52vh', transform: 'translateY(-16%) scaleY(-1) skewX(-3deg)' }}>
        KRAKEN
      </p>
    </>
  );
}
export function MirrorFront() {
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-12 pt-[1.5vh] text-center">
        <h1 className="display" style={{ fontSize: 'clamp(28px, min(5.4vh, 3.5vw), 54px)' }}>
          {LINE1}
        </h1>
      </div>
      <Below top="72vh" big={false} align="center" />
    </>
  );
}

/* 7. Name in the depths: the team above, the name itself under the water */
export function DepthsBack() {
  return (
    <p className="display absolute inset-x-0 text-center leading-none text-paper" style={{ top: '45vh', fontSize: '25.5vw', transform: 'translateY(-4%)', letterSpacing: '-0.045em' }}>
      KRAKEN
    </p>
  );
}
export function DepthsFront() {
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-12 pt-[3vh]">
        <h1 className="display max-w-[14ch]" style={{ fontSize: 'clamp(38px, min(8.6vh, 5.8vw), 96px)' }}>
          {LINE1}
        </h1>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[42vh] hidden md:block">
        <ChatChip chat={CHAT[0]} className="right-[31%] -top-[62px] buoy-a" tilt={-3} />
        <ChatChip chat={CHAT[1]} className="right-[9%] -top-[70px] buoy-b" tilt={4} />
        <ChatChip chat={CHAT[3]} className="right-[20%] -top-[148px] buoy-c hidden xl:block" tilt={-2} />
      </div>
      <Below top="68vh" big={false} />
    </>
  );
}
