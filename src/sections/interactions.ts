// The three things a visitor can do, as pure state machines plus one small store.
import { useSyncExternalStore } from 'react';

export type SparkState = { phase: 'asking' | 'yours' | 'agent' | 'timeout'; secondsLeft: number };
export type SparkAction = { type: 'tick'; seconds: number } | { type: 'me' } | { type: 'agent' };

export function sparkReducer(s: SparkState, a: SparkAction): SparkState {
  if (a.type === 'me') return s.phase === 'asking' ? { ...s, phase: 'yours' } : s;
  if (a.type === 'agent') return s.phase === 'asking' || s.phase === 'yours' ? { ...s, phase: 'agent' } : s;
  if (s.phase !== 'asking') return s; // a claimed step has no time limit
  const left = Math.max(0, s.secondsLeft - a.seconds);
  return left === 0 ? { phase: 'timeout', secondsLeft: 0 } : { phase: 'asking', secondsLeft: left };
}

export type StormPhase = 'idle' | 'sent' | 'error' | 'fixing' | 'fixed';
const ORDER: StormPhase[] = ['idle', 'sent', 'error', 'fixing', 'fixed'];

export function stormNext(p: StormPhase): StormPhase {
  return ORDER[Math.min(ORDER.length - 1, ORDER.indexOf(p) + 1)];
}
/** Only an idle storm can be sent: a second click changes nothing. */
export function stormSend(p: StormPhase): StormPhase {
  return p === 'idle' ? 'sent' : p;
}

type State = { spark: SparkState; storm: StormPhase; delivered: boolean };
let state: State = { spark: { phase: 'asking', secondsLeft: 120 }, storm: 'idle', delivered: false };
const subs = new Set<() => void>();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  subs.forEach((fn) => fn());
};

let clock: ReturnType<typeof setInterval> | null = null;
const STORM_DELAY: Record<StormPhase, number> = { idle: 0, sent: 600, error: 1500, fixing: 1300, fixed: 0 };

export const interactions = {
  get: () => state,
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
  /** Run the 2-minute clock at 10x: 120 shown seconds in 12 real ones. */
  startSparkClock() {
    if (clock || state.spark.phase !== 'asking') return;
    clock = setInterval(() => {
      set({ spark: sparkReducer(state.spark, { type: 'tick', seconds: 1 }) });
      if (state.spark.phase !== 'asking') interactions.stopSparkClock();
    }, 100);
  },
  stopSparkClock() {
    if (clock) clearInterval(clock);
    clock = null;
  },
  spark(a: 'me' | 'agent') {
    set({ spark: sparkReducer(state.spark, { type: a }) });
    interactions.stopSparkClock();
  },
  sendStorm() {
    const next = stormSend(state.storm);
    if (next === state.storm) return;
    const step = (p: StormPhase) => {
      set({ storm: p });
      if (p !== 'fixed') setTimeout(() => step(stormNext(p)), STORM_DELAY[p]);
    };
    step(next);
  },
  approve() {
    if (!state.delivered) set({ delivered: true });
  },
};

export function useInteractions(): State {
  return useSyncExternalStore(interactions.subscribe, interactions.get, interactions.get);
}
