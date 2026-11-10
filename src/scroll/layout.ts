import { SECTION_RANGES, type SectionId } from './stages';

/** Total scroll distance in viewport heights. Section heights follow from the ranges. */
export const SCROLL_VH = 1100;

export function sectionHeight(id: SectionId): string {
  const [a, b] = SECTION_RANGES[id];
  const extra = id === 'surfaceAgain' ? 100 : 0; // the last screen itself
  return `${(b - a) * SCROLL_VH + extra}vh`;
}
