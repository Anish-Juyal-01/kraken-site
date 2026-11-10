import { expect, test } from 'vitest';
import { sparkReducer, stormNext, stormSend, type SparkState, type StormPhase } from './interactions';

test('spark: me stops the clock, agent and timeout hand over', () => {
  let s: SparkState = { phase: 'asking', secondsLeft: 120 };
  expect(sparkReducer(s, { type: 'me' })).toEqual({ phase: 'yours', secondsLeft: 120 });
  expect(sparkReducer(s, { type: 'agent' }).phase).toBe('agent');
  s = sparkReducer(s, { type: 'tick', seconds: 119 });
  expect(s.phase).toBe('asking');
  s = sparkReducer(s, { type: 'tick', seconds: 5 });
  expect(s).toEqual({ phase: 'timeout', secondsLeft: 0 });
  expect(sparkReducer({ phase: 'yours', secondsLeft: 80 }, { type: 'tick', seconds: 200 }).phase).toBe('yours');
  expect(sparkReducer({ phase: 'yours', secondsLeft: 80 }, { type: 'agent' }).phase).toBe('agent');
  expect(sparkReducer({ phase: 'timeout', secondsLeft: 0 }, { type: 'me' }).phase).toBe('timeout');
});
test('storm: sending twice does not restart', () => {
  expect(stormSend('idle')).toBe('sent');
  expect(stormSend('error')).toBe('error');
  expect(stormSend('fixed')).toBe('fixed');
  expect((['idle', 'sent', 'error', 'fixing', 'fixed'] as StormPhase[]).map(stormNext)).toEqual(['sent', 'error', 'fixing', 'fixed', 'fixed']);
});
