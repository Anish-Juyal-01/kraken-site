import { HERO, LINKS } from '../content/content';
import { Button } from '../ui/Button';
import { Stage } from '../ui/Stage';

/** First screen: what Kraken is, and the creature peeking over the waterline. */
export function Surface({ flow }: { flow: boolean }) {
  return (
    <Stage id="surface" fadeIn={false} flow={flow}>
      <div className="mx-auto flex h-full max-w-[1400px] flex-col px-5 pt-20 md:px-12 md:pt-24">
        <p className="display text-[22px]">Kraken</p>
        <h1 className="display mt-6 text-[38px] sm:text-5xl md:text-[54px] lg:text-[64px]">
          {HERO.headline.split('. ').map((part, i, all) => (
            <span key={part} className="block">
              {part}
              {i < all.length - 1 ? '.' : ''}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed md:text-lg">{HERO.sub}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={LINKS.demo}>Watch the demo</Button>
          <Button href={LINKS.repo} variant="line">
            View on GitHub
          </Button>
        </div>
      </div>
    </Stage>
  );
}
