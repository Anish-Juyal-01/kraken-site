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
  y: number;
  scale: number;
  wave: number; // 0..1 strength of the idle wave on the last arm
};

export const REST: ArmPose = { reach: 0.45, curl: 0.55, lift: 0 };

export function initialState(): KrakenState {
  return {
    mood: 'neutral',
    poses: Array.from({ length: 8 }, () => ({ ...REST })),
    look: [0, 0],
    lean: [0, 0],
    ring: 0,
    activeArm: null,
    y: 0,
    scale: 1,
    wave: 0,
  };
}
