import type { SparkState, StormPhase } from '../sections/interactions';

export type MoodId = 'neutral' | 'curious' | 'concentrating' | 'startled' | 'relieved' | 'proud';
/** lid 0 open..1 closed, pupil size factor, mouth -1 "o" .. 1 big smile, squash = body height factor. */
export type Mood = { lid: number; pupil: number; mouth: number; squash: number; tongue: number };

export const MOODS: Record<MoodId, Mood> = {
  neutral: { lid: 0.12, pupil: 1, mouth: 0.5, squash: 1, tongue: 0 },
  curious: { lid: 0, pupil: 1.2, mouth: 0.3, squash: 1.04, tongue: 0 },
  concentrating: { lid: 0.45, pupil: 0.9, mouth: 0.1, squash: 0.97, tongue: 1 },
  startled: { lid: 0, pupil: 0.6, mouth: -1, squash: 1.12, tongue: 0 },
  relieved: { lid: 0.55, pupil: 1, mouth: 0.8, squash: 0.94, tongue: 0 },
  proud: { lid: 0.35, pupil: 1.1, mouth: 1, squash: 1.08, tongue: 0 },
};

export function blendMood(a: Mood, b: Mood, k: number): Mood {
  const t = !Number.isFinite(k) ? 0 : k < 0 ? 0 : k > 1 ? 1 : k;
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    lid: mix(a.lid, b.lid),
    pupil: mix(a.pupil, b.pupil),
    mouth: mix(a.mouth, b.mouth),
    squash: mix(a.squash, b.squash),
    tongue: mix(a.tongue, b.tongue),
  };
}

/** Which mood the kraken shows for the arm in front and what the visitor has done. */
export function moodFor(arm: number | null, storm: StormPhase, delivered: boolean, spark: SparkState['phase'] = 'asking'): MoodId {
  if (arm === 0) {
    if (spark === 'yours') return 'proud'; // a person took the step
    if (spark === 'agent') return 'relieved';
    if (spark === 'timeout') return 'startled';
    return 'curious';
  }
  if (arm === 7) return 'curious';
  if (arm === 3) return 'concentrating';
  if (arm === 4) {
    if (storm === 'sent' || storm === 'fixing') return 'concentrating'; // bracing, then mending
    if (storm === 'error') return 'startled';
    if (storm === 'fixed') return 'relieved';
  }
  if (arm === 5 && delivered) return 'proud';
  return 'neutral';
}
