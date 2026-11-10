import { expect, test } from 'vitest';
import { ARMS, HERO, PROBLEM, SWITCH_ROWS } from './content';

test('eight arms in order', () => {
  expect(ARMS.map((a) => a.id)).toEqual(['spark', 'sonar', 'charter', 'forge', 'storm', 'deliver', 'hallmark', 'you']);
});
test('only the last arm has no prop', () => {
  expect(ARMS.filter((a) => a.prop === null).map((a) => a.id)).toEqual(['you']);
});
test('no em or en dashes in any visible string', () => {
  const all = JSON.stringify({ ARMS, HERO, PROBLEM, SWITCH_ROWS });
  expect(all).not.toMatch(/[–—]/);
});
test('labels that keep the site honest', () => {
  const charter = ARMS.find((a) => a.id === 'charter')!;
  expect(charter.messages.find((m) => m.who === 'gemini-coder')!.note).toMatch(/K-10/);
  expect(ARMS.find((a) => a.id === 'sonar')!.messages[0].note).toMatch(/demo app/);
  expect(JSON.stringify(ARMS)).not.toMatch(/\/pull\/\d+/);
});
test('hero subtext is at most 20 words', () => {
  expect(HERO.sub.split(/\s+/).length).toBeLessThanOrEqual(20);
});
