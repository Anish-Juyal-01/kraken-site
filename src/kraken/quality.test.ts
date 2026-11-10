import { expect, test } from 'vitest';
import { qualityFor } from './quality';

const fast = { width: 1440, reducedMotion: false, webgl: true, cores: 12 };
test('a wide, fast device gets the full scene', () => {
  expect(qualityFor(fast)).toEqual({ mode: 'full', armSegments: 24, outline: true, bubbles: 40, loop: true });
});
test('phones and slow devices get the lite scene', () => {
  const lite = { mode: 'lite', armSegments: 12, outline: false, bubbles: 12, loop: true };
  expect(qualityFor({ ...fast, width: 375 })).toEqual(lite);
  expect(qualityFor({ ...fast, cores: 4 })).toEqual(lite);
});
test('reduced motion means a still scene, even on a fast device', () => {
  const q = qualityFor({ ...fast, reducedMotion: true });
  expect(q.mode).toBe('still');
  expect(q.loop).toBe(false);
  expect(q.bubbles).toBe(0);
});
test('no WebGL wins over everything', () => {
  expect(qualityFor({ ...fast, webgl: false }).mode).toBe('none');
  expect(qualityFor({ width: 375, reducedMotion: true, webgl: false, cores: 2 }).mode).toBe('none');
});
test('bad numbers fall back to the lite scene, never crash', () => {
  expect(qualityFor({ width: NaN, reducedMotion: false, webgl: true, cores: NaN }).mode).toBe('lite');
});
