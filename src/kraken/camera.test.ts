import { expect, test } from 'vitest';
import { cameraAt, krakenPlacement, waterTop } from './camera';
import { DEEP, INK, PAPER, depthColor, depthMix, inkColor } from './depth';

test('paper at the surface, deep from the dive to the end of the page, clamped outside', () => {
  expect(depthColor(0)).toBe(PAPER);
  expect(depthColor(1)).toBe(DEEP); // the page ends on the ocean bed
  expect(depthColor(0.5)).toBe(DEEP);
  expect(depthColor(-1)).toBe(depthColor(0));
  expect(depthColor(NaN)).toBe(PAPER);
  expect(depthMix(0.3)).toBe(1);
});
test('ink flips with the background', () => {
  expect(inkColor(0)).toBe(INK);
  expect(inkColor(0.5)).toBe(PAPER);
});
test('camera and kraken are finite everywhere and the camera sinks', () => {
  for (const p of [-1, 0, 0.3, 0.72, 1, 2, NaN]) {
    cameraAt(p).pos.forEach((n) => expect(Number.isFinite(n)).toBe(true));
    Object.values(krakenPlacement(p, 1.6)).forEach((n) => expect(Number.isFinite(n)).toBe(true));
    expect(Number.isFinite(waterTop(p))).toBe(true);
  }
  expect(cameraAt(0.5).pos[1]).toBeLessThan(cameraAt(0.05).pos[1]);
});
test('the kraken peeks at the surface, is centred for the eight arms, and stays on the sea floor at the end', () => {
  const hero = krakenPlacement(0, 1.6);
  const mid = krakenPlacement(0.5, 1.6);
  const end = krakenPlacement(1, 1.6);
  expect(hero.y).toBeLessThan(mid.y);
  expect(mid.x).toBe(0);
  expect(mid.z).toBe(0);
  expect(end.y).toBeLessThan(mid.y);
  expect(end.x).toBeGreaterThan(1); // off to the side, by the run steps
  expect(krakenPlacement(0.23, 1.6).z).toBeLessThan(-5); // far below during the descent
});
test('the waterline sits at 68% on the surface and is off-screen in the deep', () => {
  expect(waterTop(0)).toBe(68);
  expect(waterTop(1)).toBeLessThan(0); // never back to the surface
  expect(waterTop(0.5)).toBeLessThan(0);
  expect(waterTop(0, 0.46)).toBe(78); // lower on phones, so the text above stays clear
  expect(krakenPlacement(0, 0.46).scale).toBeLessThan(1);
});
