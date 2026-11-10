// Where the camera, the kraken and the waterline are for a given scroll progress. Pure.
import { SECTION_RANGES as R, clamp01 } from '../scroll/stages';

const smooth = (t: number) => t * t * (3 - 2 * t);
const span = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function cameraAt(p: number): { pos: [number, number, number]; look: [number, number, number] } {
  const c = clamp01(p);
  const down = span(c, R.waterline[0], R.creature[0]);
  const up = span(c, R.ascent[0], R.surfaceAgain[0] + 0.02);
  const d = clamp01(down - up);
  return { pos: [0, mix(0.5, 0.25, d), mix(8.5, 9.2, d)], look: [0, mix(0.5, 0.15, d), 0] };
}

const PEEK_Y = -0.77; // eyes just above the waterline
export type Placement = { x: number; y: number; z: number; scale: number };

/** `aspect` = viewport width / height: on narrow screens the kraken stays nearer the middle. */
export function krakenPlacement(p: number, aspect: number): Placement {
  const c = clamp01(p);
  const a = Number.isFinite(aspect) && aspect > 0 ? aspect : 1.6;
  const sideX = Math.min(1.75, 2.44 * a * 0.45);
  const duck = span(c, R.surface[1] - 0.02, R.waterline[1]); // hides under the water
  const arrive = span(c, R.descent[0] + 0.03, R.creature[0]); // swims up from far below
  const leave = span(c, R.creature[1], R.floor[0] + 0.05); // moves aside on the sea floor
  const rise = span(c, R.ascent[0], R.surfaceAgain[0] + 0.03); // back to the surface

  if (c < R.descent[0] + 0.03) {
    return { x: sideX, y: mix(PEEK_Y, -4.5, duck), z: 0, scale: 1 };
  }
  // On a tall (phone) screen the card sits below, so the kraken sits higher and smaller.
  const tall = a < 0.9;
  const midY = tall ? 1.25 : 0;
  const midScale = tall ? 0.6 : 1;
  if (c < R.creature[1]) {
    return { x: mix(sideX * 1.5, 0, arrive * arrive), y: mix(-3.2, midY, arrive), z: mix(-9, 0, arrive), scale: mix(1, midScale, arrive) };
  }
  if (c < R.ascent[0]) {
    return { x: mix(0, sideX, leave), y: mix(midY, -0.9, leave), z: mix(0, -1.5, leave), scale: mix(midScale, 0.8, leave) };
  }
  return { x: sideX, y: mix(-0.9, PEEK_Y, rise), z: mix(-1.5, 0, rise), scale: mix(0.8, 1, rise) };
}

/** Top edge of the water, in vh from the top of the screen. */
export function waterTop(p: number): number {
  const c = clamp01(p);
  const down = span(c, R.surface[1] - 0.03, R.waterline[1] - 0.02);
  const up = span(c, R.ascent[0] + 0.01, R.surfaceAgain[0] + 0.03);
  return mix(68, -25, clamp01(down - up));
}
