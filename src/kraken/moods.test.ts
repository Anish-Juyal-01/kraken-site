import { expect, test } from 'vitest';
import { MOODS, blendMood, moodFor } from './moods';

test('blend is linear and clamped', () => {
  expect(blendMood(MOODS.neutral, MOODS.startled, 0)).toEqual(MOODS.neutral);
  expect(blendMood(MOODS.neutral, MOODS.startled, 1)).toEqual(MOODS.startled);
  expect(blendMood(MOODS.neutral, MOODS.startled, 5)).toEqual(MOODS.startled);
  expect(blendMood(MOODS.neutral, MOODS.startled, NaN)).toEqual(MOODS.neutral);
});
test('moods read as what they are', () => {
  expect(MOODS.startled.pupil).toBeLessThan(MOODS.neutral.pupil);
  expect(MOODS.startled.lid).toBe(0);
  expect(MOODS.concentrating.tongue).toBe(1);
  expect(MOODS.proud.mouth).toBe(1);
});
test('mood per stage', () => {
  expect(moodFor(0, 'idle', false)).toBe('curious');
  expect(moodFor(3, 'idle', false)).toBe('concentrating');
  expect(moodFor(4, 'idle', false)).toBe('neutral');
  expect(moodFor(4, 'error', false)).toBe('startled');
  expect(moodFor(4, 'sent', false)).toBe('concentrating');
  expect(moodFor(4, 'fixing', false)).toBe('concentrating');
  expect(moodFor(0, 'idle', false, 'yours')).toBe('proud');
  expect(moodFor(0, 'idle', false, 'agent')).toBe('relieved');
  expect(moodFor(0, 'idle', false, 'timeout')).toBe('startled');
  expect(moodFor(4, 'fixed', false)).toBe('relieved');
  expect(moodFor(5, 'idle', false)).toBe('neutral');
  expect(moodFor(5, 'idle', true)).toBe('proud');
  expect(moodFor(null, 'error', true)).toBe('neutral');
  expect(moodFor(7, 'idle', false)).toBe('curious');
});
