import { useState } from 'react';
import { LINKS, RUN_STEPS } from '../content/content';
import { Button } from '../ui/Button';
import { Stage } from '../ui/Stage';

const INK = '#0b2420';
const HULL = '#ece7d9';
const CORAL = '#e8553d';

/** A small submarine parked on the ocean bed. Its big window is the demo video. */
function Submarine({ children }: { children: React.ReactNode }) {
  return (
    <div className="sub-bob relative aspect-[760/440] w-full max-w-[700px]">
      <svg className="absolute inset-0 size-full" viewBox="0 0 760 440" fill="none" aria-hidden>
        {/* periscope and conning tower */}
        <path d="M398 78 V30 H452" stroke={HULL} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="456" cy="30" r="12" fill={CORAL} />
        <path d="M318 132 V96 a26 26 0 0 1 26 -26 h108 a26 26 0 0 1 26 26 v36 Z" fill={HULL} />
        <rect x="350" y="92" width="96" height="14" rx="7" fill={INK} opacity="0.85" />
        {/* tail fins and propeller */}
        <path d="M78 190 L18 142 V238 Z" fill={CORAL} />
        <path d="M78 330 L18 378 V282 Z" fill={CORAL} />
        <g className="sub-prop" style={{ transformOrigin: '34px 260px' }}>
          <ellipse cx="34" cy="226" rx="12" ry="32" fill={HULL} />
          <ellipse cx="34" cy="294" rx="12" ry="32" fill={HULL} />
        </g>
        <circle cx="34" cy="260" r="11" fill={INK} />
        {/* hull */}
        <rect x="48" y="120" width="672" height="280" rx="140" fill={HULL} />
        <path d="M120 372 H648" stroke={CORAL} strokeWidth="10" strokeLinecap="round" />
        {/* small portholes */}
        <circle cx="112" cy="258" r="22" fill={INK} />
        <circle cx="112" cy="258" r="13" fill="#1f5a4e" />
        <circle cx="664" cy="258" r="22" fill={INK} />
        <circle cx="664" cy="258" r="13" fill="#1f5a4e" />
        {/* the big window frame: the video sits inside it */}
        <rect x="158" y="146" width="444" height="222" rx="30" fill={INK} />
        {[168, 592].flatMap((x) => [156, 358].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={HULL} />))}
      </svg>
      {/* window opening, in the same coordinates as the frame above */}
      <div className="absolute overflow-hidden rounded-[18px] bg-deep" style={{ left: '22.2%', top: '35.6%', width: '55.6%', height: '45.6%' }}>
        {children}
      </div>
      {/* bubbles from the propeller */}
      <span className="sub-bubble absolute left-[1%] top-[48%] size-2.5 rounded-full bg-paper/50" />
      <span className="sub-bubble sub-bubble-b absolute left-[-1%] top-[60%] size-1.5 rounded-full bg-paper/50" />
      <span className="sub-bubble sub-bubble-c absolute left-[2%] top-[66%] size-2 rounded-full bg-paper/50" />
    </div>
  );
}

/** The end of the page, on the ocean bed: watch it, run it. */
export function SurfaceAgain({ flow }: { flow: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState<'no' | 'yes' | 'failed'>('no');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(RUN_STEPS.join('\n'));
      setCopied('yes');
    } catch {
      setCopied('failed');
    }
    setTimeout(() => setCopied('no'), 2200);
  };

  return (
    <Stage id="surfaceAgain" fadeOut={false} flow={flow}>
      <div className="mx-auto grid h-full max-w-[1400px] content-start gap-6 px-5 pt-12 md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-12 md:pt-[7vh]">
        <div>
          <h2 className="display text-4xl md:text-5xl">See it run</h2>
          <div className="mt-4">
            <Submarine>
              {playing ? (
                <iframe className="size-full" src={LINKS.demoEmbed} title="Kraken demo video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              ) : (
                <button type="button" onClick={() => setPlaying(true)} className="group grid size-full place-items-center text-paper" aria-label="Play the demo video">
                  <span className="flex items-center gap-3 text-[16px] font-semibold">
                    <span className="grid size-12 place-items-center rounded-full bg-coral text-deep transition-transform group-hover:scale-105 group-active:scale-95">
                      <svg width="16" height="18" viewBox="0 0 18 20" aria-hidden>
                        <path d="M2 1.5v17l14.5-8.5z" fill="currentColor" />
                      </svg>
                    </span>
                    Play the 2 minute demo
                  </span>
                </button>
              )}
            </Submarine>
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="display text-2xl md:mt-3 md:text-3xl">Run it yourself</h2>
          <div className="relative mt-4 max-w-[560px]">
            <pre className="whitespace-pre-wrap rounded-[var(--radius-card)] border border-[var(--line-now)] bg-[#0f332c] p-4 pr-20 font-mono text-[12.5px] leading-[1.75] text-paper [overflow-wrap:anywhere]">
              <code>{RUN_STEPS.join('\n')}</code>
            </pre>
            <button type="button" onClick={copy} className="absolute right-2.5 top-2.5 rounded-full bg-paper px-3 py-1 text-[12.5px] font-semibold text-deep active:scale-95">
              {copied === 'yes' ? 'Copied' : copied === 'failed' ? 'Select it' : 'Copy'}
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={LINKS.repo}>View on GitHub</Button>
          </div>
        </div>
      </div>
    </Stage>
  );
}
