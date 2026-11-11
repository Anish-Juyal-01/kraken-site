import { expect, test } from 'vitest';
import { ARMS, DELIVER, HERO, PROBLEM, SPARK, STORM, SWITCH_ROWS } from './content';

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
test('one example request runs through every step', () => {
  const all = JSON.stringify({ ARMS, STORM, DELIVER, SPARK });
  expect(all.match(/K-\d+/g)!.every((tag) => tag === 'K-42')).toBe(true);
  expect(all).not.toMatch(/\/pull\/\d+/); // no made-up pull request links
});
test('three different vendors bid at Charter', () => {
  const who = ARMS.find((a) => a.id === 'charter')!.messages.map((m) => m.who);
  expect(who).toEqual(['claude-coder', 'codex-coder', 'gemini-coder']);
});
test('hero subtext is at most 20 words', () => {
  expect(HERO.sub.split(/\s+/).length).toBeLessThanOrEqual(20);
});
