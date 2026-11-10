import { expect, test } from 'vitest';
import { SECTION_RANGES, armIndexAt, localProgress, sectionAt, progressOfArm } from './stages';

test('ranges are contiguous and cover 0..1', () => {
  const r = Object.values(SECTION_RANGES).sort((a, b) => a[0] - b[0]);
  expect(r[0][0]).toBe(0);
  expect(r.at(-1)![1]).toBe(1);
  r.slice(1).forEach((x, i) => expect(x[0]).toBe(r[i][1]));
});
test('clamps out-of-range progress', () => {
  expect(sectionAt(-0.2)).toBe('surface');
  expect(sectionAt(1.4)).toBe('surfaceAgain');
  expect(sectionAt(NaN)).toBe('surface');
  expect(localProgress(9, 'creature')).toBe(1);
  expect(localProgress(-3, 'creature')).toBe(0);
  expect(Number.isNaN(localProgress(NaN, 'creature'))).toBe(false);
});
test('eight equal arm slices inside the creature section', () => {
  expect(armIndexAt(0.29)).toBeNull();
  expect(armIndexAt(0.3)).toBe(0);
  expect(armIndexAt(0.719)).toBe(7);
  expect(armIndexAt(0.73)).toBeNull();
  expect(armIndexAt(NaN)).toBeNull();
});
test('the gauge can jump to the middle of an arm slice', () => {
  for (let i = 0; i < 8; i++) expect(armIndexAt(progressOfArm(i))).toBe(i);
});
