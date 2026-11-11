// The page darkens once as you dive and lightens once as you rise.
import { SECTION_RANGES, clamp01 } from '../scroll/stages';

export const PAPER = '#ece7d9';
export const DEEP = '#0b2420';
export const INK = '#12332d';

const smooth = (t: number) => t * t * (3 - 2 * t);
const span = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));

/** 0 on paper, 1 in the deep. */
export function depthMix(p: number): number {
  const c = clamp01(p);
  const down = span(c, SECTION_RANGES.waterline[0], SECTION_RANGES.waterline[1] + 0.04);
  return down; // once under, the page stays under: it ends on the ocean bed
}

function hex(n: number) {
  return Math.round(n).toString(16).padStart(2, '0');
}
function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => hex(v + (pb[i] - v) * t)).join('');
}

export function depthColor(p: number): string {
  return mixHex(PAPER, DEEP, depthMix(p));
}

/** Text colour: ink on paper, bone in the deep. Flips where the background passes the middle. */
export function inkColor(p: number): string {
  return depthMix(p) > 0.5 ? PAPER : INK;
}
