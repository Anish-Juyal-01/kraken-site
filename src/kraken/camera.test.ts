import { expect, test } from 'vitest';
import { cameraAt, krakenPlacement, waterTop } from './camera';
import { depthColor, depthMix, inkColor } from './depth';

test('paper at both ends, deep in the middle, clamped outside', () => {
  expect(depthColor(0)).toBe('#ece7d9');
  expect(depthColor(1)).toBe('#ece7d9');
  expect(depthColor(0.5)).toBe('#0b2420');
  expect(depthColor(-1)).toBe(depthColor(0));
  expect(depthColor(NaN)).toBe('#ece7d9');
  expect(depthMix(0.3)).toBe(1);
});
test('ink flips with the background', () => {
  expect(inkColor(0)).toBe('#12332d');
  expect(inkColor(0.5)).toBe('#ece7d9');
});
test('camera and kraken are finite everywhere and the camera sinks', () => {
  for (const p of [-1, 0, 0.3, 0.72, 1, 2, NaN]) {
    cameraAt(p).pos.forEach((n) => expect(Number.isFinite(n)).toBe(true));
    Object.values(krakenPlacement(p, 1.6)).forEach((n) => expect(Number.isFinite(n)).toBe(true));
    expect(Number.isFinite(waterTop(p))).toBe(true);
  }
  expect(cameraAt(0.5).pos[1]).toBeLessThan(cameraAt(0.05).pos[1]);
});
test('the kraken peeks at the surface, is centred for the eight arms, and peeks again at the end', () => {
  const hero = krakenPlacement(0, 1.6);
  const mid = krakenPlacement(0.5, 1.6);
  const end = krakenPlacement(1, 1.6);
  expect(hero.y).toBeLessThan(mid.y);
  expect(mid.x).toBe(0);
  expect(mid.z).toBe(0);
  expect(end.y).toBeCloseTo(hero.y);
  expect(krakenPlacement(0.23, 1.6).z).toBeLessThan(-5); // far below during the descent
});
test('the waterline sits at 68% on the surface and is off-screen in the deep', () => {
  expect(waterTop(0)).toBe(68);
  expect(waterTop(1)).toBe(68);
  expect(waterTop(0.5)).toBeLessThan(0);
});
