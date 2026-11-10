// The one mapping from scroll progress (0..1) to where the visitor is. Pure and clamped:
// overscroll, resize and bad input can never produce an undefined stage.
export type SectionId = 'surface' | 'waterline' | 'descent' | 'creature' | 'floor' | 'ascent' | 'surfaceAgain';

export const SECTION_RANGES: Record<SectionId, [number, number]> = {
  surface: [0, 0.1],
  waterline: [0.1, 0.18],
  descent: [0.18, 0.3],
  creature: [0.3, 0.72],
  floor: [0.72, 0.86],
  ascent: [0.86, 0.92],
  surfaceAgain: [0.92, 1],
};

export const SECTION_ORDER = Object.keys(SECTION_RANGES) as SectionId[];
export const ARM_COUNT = 8;

export function clamp01(p: number): number {
  if (!Number.isFinite(p)) return 0;
  return p < 0 ? 0 : p > 1 ? 1 : p;
}

export function sectionAt(p: number): SectionId {
  const c = clamp01(p);
  for (const id of SECTION_ORDER) if (c < SECTION_RANGES[id][1]) return id;
  return 'surfaceAgain';
}

export function localProgress(p: number, s: SectionId): number {
  const [a, b] = SECTION_RANGES[s];
  return clamp01((clamp01(p) - a) / (b - a));
}

/** 0..7 while inside the creature section, else null. */
export function armIndexAt(p: number): number | null {
  if (!Number.isFinite(p)) return null;
  const [a, b] = SECTION_RANGES.creature;
  if (p < a || p >= b) return null;
  return Math.min(ARM_COUNT - 1, Math.floor(((p - a) / (b - a)) * ARM_COUNT));
}

/** Progress inside one arm's slice, 0..1. */
export function armLocal(p: number): number {
  const [a, b] = SECTION_RANGES.creature;
  const x = clamp01((clamp01(p) - a) / (b - a)) * ARM_COUNT;
  return x >= ARM_COUNT ? 1 : x - Math.floor(x);
}

/** Scroll progress at the middle of arm i's slice (for the gauge's jump links). */
export function progressOfArm(i: number): number {
  const [a, b] = SECTION_RANGES.creature;
  return a + ((i + 0.5) / ARM_COUNT) * (b - a);
}
