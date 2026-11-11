import { expect, test } from 'vitest';
import { armPoints, armRadius, ARM_RING } from './armCurve';

const pts = armPoints(0, 0, { reach: 0.5, curl: 0.3, lift: 0 }, [0, 0], 24);
test('returns segments+1 finite points anchored on the body ring', () => {
  expect(pts).toHaveLength(25);
  pts.flat().forEach((n) => expect(Number.isFinite(n)).toBe(true));
  expect(Math.hypot(pts[0][0], pts[0][2])).toBeCloseTo(ARM_RING, 2);
  expect(ARM_RING).toBe(0.55);
});
test('more reach makes a longer arm', () => {
  const len = (r: number) => {
    const p = armPoints(0, 0, { reach: r, curl: 0, lift: 0 }, [0, 0], 24);
    return Math.hypot(p[24][0] - p[0][0], p[24][1] - p[0][1], p[24][2] - p[0][2]);
  };
  expect(len(1)).toBeGreaterThan(len(0.2));
});
test('radius tapers from 0.22 to 0.05', () => {
  expect(armRadius(0)).toBeCloseTo(0.22);
  expect(armRadius(1)).toBeCloseTo(0.05);
  expect(armRadius(0.5)).toBeLessThan(armRadius(0.25));
});
test('lean can push the tip along z as well, for a ring of arms that has turned', () => {
  const flat = armPoints(0, 0, { reach: 0.5, curl: 0.3, lift: 0 }, [0, 0], 24);
  const pushed = armPoints(0, 0, { reach: 0.5, curl: 0.3, lift: 0 }, [0, 0, 1], 24);
  expect(pushed[24][2]).toBeGreaterThan(flat[24][2]);
  expect(pushed[0][2]).toBeCloseTo(flat[0][2]); // the root does not move
});
test('bad input never produces NaN', () => {
  armPoints(3, NaN, { reach: NaN, curl: 9, lift: -4 }, [NaN, 2], 12).flat().forEach((n) => expect(Number.isFinite(n)).toBe(true));
});
