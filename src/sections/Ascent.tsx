import { ASCENT } from '../content/content';
import { Stage } from '../ui/Stage';

/** One fast rise back to the surface. */
export function Ascent({ flow }: { flow: boolean }) {
  return (
    <Stage id="ascent" flow={flow}>
      <div className="mx-auto flex h-full max-w-[1400px] items-center px-5 md:px-12">
        <p className="display max-w-[18ch] text-4xl md:text-6xl">{ASCENT}</p>
      </div>
    </Stage>
  );
}
