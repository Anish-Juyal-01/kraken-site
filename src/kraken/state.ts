import type { ArmPose } from './armCurve';
import type { MoodId } from './moods';

/** Everything the scene tells the kraken each frame. Mutated in place: no React re-renders. */
export type KrakenState = {
  mood: MoodId;
  poses: ArmPose[];
  look: [number, number];
  lean: [number, number];
  ring: number; // rotation of the ring of arms, radians
  activeArm: number | null;
  x: number;
  y: number;
  z: number;
  scale: number;
  wave: number; // 0..1 strength of the idle wave on the last arm
  lastMove: number; // performance.now() of the last pointer move
  cursor: [number, number]; // pointer position, -1..1 across the screen
  ringNow: number; // how far the ring of arms is turned right now
  flinch: number; // 0..1, arms pulled in after a fright
  cheer: number; // 0..1, arms thrown up when something went well
};

export const REST: ArmPose = { reach: 0.5, curl: 0.78, lift: 0.04 };

export function initialState(): KrakenState {
  return {
    mood: 'neutral',
    poses: Array.from({ length: 8 }, () => ({ ...REST })),
    look: [0, 0],
    lean: [0, 0],
    ring: 0,
    activeArm: null,
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    wave: 0,
    lastMove: 0,
    cursor: [0, 0.15],
    ringNow: 0,
    flinch: 0,
    cheer: 0,
  };
}
