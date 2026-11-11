// Pure arm geometry. An arm is a curve in the vertical plane through the body's centre and the
// arm's direction: it leaves the underside of the body going down and out, then curls up.
export type ArmPose = { reach: number; curl: number; lift: number };
export type Vec3 = [number, number, number];

export const ARM_RING = 0.55; // radius of the ring the arms attach to, under the body
export const ARM_ROOT_Y = -0.35;
const ARM_OFFSET = Math.PI / 8; // so no arm points straight at the camera

const fin = (n: number, d = 0) => (Number.isFinite(n) ? n : d);
const c01 = (n: number) => Math.min(1, Math.max(0, fin(n)));

export function armAngle(index: number): number {
  return index * (Math.PI / 4) + ARM_OFFSET;
}

/** Radius along the arm, t = 0 at the root, 1 at the tip. */
export function armRadius(t: number): number {
  const x = c01(t);
  return 0.22 + (0.05 - 0.22) * Math.pow(x, 0.85);
}

export function armPoints(index: number, time: number, pose: ArmPose, lean: [number, number, number?], segments: number, lengthScale = 1): Vec3[] {
  const reach = c01(pose.reach);
  const curl = c01(pose.curl);
  const lift = c01(pose.lift);
  const t = fin(time);
  const lx = Math.max(-1, Math.min(1, fin(lean[0])));
  const ly = Math.max(-1, Math.min(1, fin(lean[1])));
  const lz = Math.max(-1, Math.min(1, fin(lean[2] ?? 0)));
  const a = armAngle(index);
  const dx = Math.cos(a);
  const dz = Math.sin(a);
  const length = (0.9 + 1.15 * reach) * (Number.isFinite(lengthScale) && lengthScale > 0 ? lengthScale : 1);
  const ds = length / segments;

  let r = ARM_RING;
  let y = ARM_ROOT_Y;
  const pts: Vec3[] = [];
  for (let k = 0; k <= segments; k++) {
    const s = k / segments;
    const sway = Math.sin(t * 1.3 + index * 0.9 + s * 3) * 0.14 * s;
    const side = Math.sin(t * 0.9 + index * 1.7 + s * 2) * 0.1 * s; // out of the arm's plane
    const lean2 = s * s * 0.7;
    pts.push([
      dx * r - dz * side + lx * lean2,
      y + ly * lean2,
      dz * r + dx * side + lz * lean2,
    ]);
    const theta = -1.0 + lift * 1.5 + (0.6 + 2.6 * curl) * Math.pow(s, 1.4) + sway;
    r += Math.cos(theta) * ds;
    y += Math.sin(theta) * ds;
  }
  return pts;
}
