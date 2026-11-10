import { SECTION_RANGES, type SectionId } from './stages';

/** Total scroll distance in viewport heights. Section heights follow from the ranges. */
export const SCROLL_VH = 1100;

export function sectionHeight(id: SectionId): string {
  const [a, b] = SECTION_RANGES[id];
  const extra = id === 'surfaceAgain' ? 100 : 0; // the last screen itself
  return `${(b - a) * SCROLL_VH + extra}vh`;
}

/** Reduced motion: sections are ordinary blocks, so each one names the scroll progress the
 *  scene should show while it is on screen. */
export const FLOW_PROGRESS: Record<SectionId, number> = {
  surface: 0,
  waterline: 0.17,
  descent: 0.27,
  creature: 0.33,
  floor: 0.8,
  ascent: 0.87,
  surfaceAgain: 1,
};
