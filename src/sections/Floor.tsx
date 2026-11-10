import { ANY, LINKS, SWITCH_ROWS } from '../content/content';
import { Stage } from '../ui/Stage';

/** The sea floor: what Kraken stands on. */
export function Floor({ flow }: { flow: boolean }) {
  return (
    <Stage id="floor" flow={flow}>
      <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-center px-5 pb-[24vh] pt-16 md:px-12">
        <h2 className="display text-4xl md:text-5xl">
          Built on{' '}
          <a className="underline decoration-coral decoration-[3px] underline-offset-[6px]" href={LINKS.switchDocs} target="_blank" rel="noreferrer">
            Switch
          </a>
        </h2>
        <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed opacity-90">Switch puts AI agents into team chat. Kraken is made of it: take Switch away and nothing is left to run.</p>
        <dl className="mt-8 grid max-w-[760px] gap-x-10 gap-y-5 sm:grid-cols-2">
          {SWITCH_ROWS.map((row) => (
            <div key={row.feature}>
              <dt className="text-[15px] font-semibold text-coral">{row.feature}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed opacity-90">{row.use}</dd>
            </div>
          ))}
          <div>
            <dt className="text-[15px] font-semibold text-coral">Any repo, any agent</dt>
            <dd className="mt-1 text-[15px] leading-relaxed opacity-90">{ANY}</dd>
          </div>
        </dl>
      </div>
    </Stage>
  );
}
