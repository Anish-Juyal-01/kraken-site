import { useState } from 'react';
import { LINKS, RUN_STEPS } from '../content/content';
import { Button } from '../ui/Button';
import { Stage } from '../ui/Stage';

/** Back at the surface: watch it, run it. */
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
      <div className="mx-auto grid h-full max-w-[1400px] content-start gap-6 px-5 pt-14 md:grid-cols-[1.05fr_1fr] md:gap-10 md:px-12 md:pt-20">
        <div>
          <h2 className="display text-4xl md:text-5xl">See it run</h2>
          <div className="mt-5 aspect-video w-full max-w-[560px] overflow-hidden rounded-[var(--radius-card)] bg-deep">
            {playing ? (
              <iframe className="size-full" src={LINKS.demoEmbed} title="Kraken demo video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            ) : (
              <button type="button" onClick={() => setPlaying(true)} className="group grid size-full place-items-center text-paper" aria-label="Play the demo video">
                <span className="flex items-center gap-3 text-[17px] font-semibold">
                  <span className="grid size-14 place-items-center rounded-full bg-coral text-deep transition-transform group-hover:scale-105 group-active:scale-95">
                    <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
                      <path d="M2 1.5v17l14.5-8.5z" fill="currentColor" />
                    </svg>
                  </span>
                  Play the 2 minute demo
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="display text-2xl md:mt-3 md:text-3xl">Run it yourself</h2>
          <div className="relative mt-4 max-w-[560px]">
            <pre className="overflow-x-auto rounded-[var(--radius-card)] bg-deep p-4 pr-20 font-mono text-[12.5px] leading-[1.75] text-paper">
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
