import { armAngle, type ArmPose } from './armCurve';
import { REST } from './state';

const HOLD: ArmPose = { reach: 1, curl: 0.34, lift: 0.8 };
const c01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

/** Eight arm poses: the active arm reaches out holding its prop, the rest hang relaxed. */
export function posesFor(activeArm: number | null, k: number): ArmPose[] {
  const t = c01(k);
  return Array.from({ length: 8 }, (_, i) => {
    if (i !== activeArm) return { ...REST };
    return {
      reach: REST.reach + (HOLD.reach - REST.reach) * t,
      curl: REST.curl + (HOLD.curl - REST.curl) * t,
      lift: REST.lift + (HOLD.lift - REST.lift) * t,
    };
  });
}

/** How far to turn the ring of arms so the active one points at its card. Cards sit to the
 *  right for even arms and to the left for odd ones; on a tall screen they sit below. */
export function ringFor(activeArm: number | null, wide: boolean): number {
  if (activeArm === null || activeArm < 0 || activeArm > 7) return 0;
  const target = !wide ? Math.PI / 2 : activeArm % 2 === 0 ? 0.42 : Math.PI - 0.42;
  return armAngle(activeArm) - target;
}
