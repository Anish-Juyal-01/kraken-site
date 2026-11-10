import { expect, test } from 'vitest';
import { posesFor, ringFor } from './poses';
import { armAngle } from './armCurve';

test('eight poses, the active arm reaches furthest, null means all resting', () => {
  const p = posesFor(4, 1);
  expect(p).toHaveLength(8);
  expect(p[4].reach).toBe(1);
  expect(Math.max(...posesFor(null, 1).map((x) => x.reach))).toBeLessThan(1);
  expect(posesFor(4, 0)[4].reach).toBeLessThan(1);
  expect(posesFor(99, NaN)).toHaveLength(8);
});
test('the ring turns the active arm to its card side: right for even arms, left for odd', () => {
  const world = (i: number, wide = true) => armAngle(i) - ringFor(i, wide);
  expect(Math.cos(world(0))).toBeGreaterThan(0.5);
  expect(Math.cos(world(1))).toBeLessThan(-0.5);
  expect(Math.sin(world(2))).toBeGreaterThan(0); // towards the camera, not behind the head
  expect(Math.sin(world(3, false))).toBeGreaterThan(0.9); // on a phone: straight forward
  expect(ringFor(null, true)).toBe(0);
});
