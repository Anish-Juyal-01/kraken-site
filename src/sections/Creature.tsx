import { useEffect, useState } from 'react';
import { ARMS, DELIVER, SPARK, STORM, type Arm } from '../content/content';
import { scrollStore } from '../scroll/store';
import { armIndexAt } from '../scroll/stages';
import { Button } from '../ui/Button';
import { ChatCard } from '../ui/ChatCard';
import { Stage } from '../ui/Stage';
import { interactions, useInteractions } from './interactions';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function SparkPanel() {
  const { spark } = useInteractions();
  useEffect(() => {
    interactions.startSparkClock();
    return () => interactions.stopSparkClock(); // scrolled away: the clock stops where it was
  }, []);
  if (spark.phase === 'asking')
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <Button onClick={() => interactions.spark('me')}>🙋 I will do it</Button>
        <Button onClick={() => interactions.spark('agent')} variant="line">
          🤖 Agent
        </Button>
        <span className="font-mono text-[15px] tabular-nums" aria-label={`${spark.secondsLeft} seconds left`}>
          {clock(spark.secondsLeft)}
        </span>
      </div>
    );
  const text = spark.phase === 'yours' ? SPARK.yours : spark.phase === 'agent' ? SPARK.agentChosen : SPARK.agent;
  return (
    <div className="mt-3 space-y-2.5" aria-live="polite">
      <ChatCard msg={{ who: 'kraken', text }} />
      {spark.phase === 'yours' && (
        <Button onClick={() => interactions.spark('agent')} variant="line">
          🤖 Agent
        </Button>
      )}
    </div>
  );
}

function StormPanel() {
  const { storm } = useInteractions();
  const showError = storm === 'error' || storm === 'fixing';
  return (
    <div className="mt-3" aria-live="polite">
      <p className="font-mono text-[13px] opacity-80">{STORM.request}</p>
      {storm === 'idle' && (
        <div className="mt-3">
          <Button onClick={interactions.sendStorm}>{STORM.button}</Button>
        </div>
      )}
      {storm === 'sent' && <p className="mt-3 font-mono text-[14px]">sending…</p>}
      {(showError || storm === 'fixed') && (
        <div className="mt-3 flex items-baseline gap-3">
          <span className={`display text-6xl ${showError ? 'text-coral' : ''}`}>{showError ? STORM.error.code : STORM.fixed.code}</span>
          <span className="font-mono text-[13px]">{showError ? STORM.error.text : STORM.fixed.text}</span>
        </div>
      )}
      {showError && <p className="mt-1.5 text-[14px] opacity-85">{STORM.error.why}</p>}
      {(storm === 'fixing' || storm === 'fixed') && (
        <div className="mt-3">
          <ChatCard msg={STORM.fix} />
        </div>
      )}
      {storm === 'fixed' && <p className="mt-2 text-[14px] opacity-85">{STORM.fixed.why}</p>}
    </div>
  );
}

function DeliverPanel() {
  const { delivered } = useInteractions();
  return (
    <div className="mt-3" aria-live="polite">
      {delivered ? <ChatCard msg={{ who: 'kraken', text: DELIVER.approved }} /> : <Button onClick={interactions.approve}>👍 Approve</Button>}
    </div>
  );
}

export function ArmCard({ arm }: { arm: Arm }) {
  return (
    <div>
      <h2 className="display text-4xl md:text-5xl">{arm.name}</h2>
      <p className="mt-2.5 text-[16px] leading-relaxed md:text-[17px]">{arm.line}</p>
      <div className="mt-4 space-y-2.5">
        {arm.messages.map((m) => (
          <ChatCard key={m.who + m.text} msg={m} />
        ))}
      </div>
      {arm.id === 'spark' && <SparkPanel />}
      {arm.id === 'storm' && <StormPanel />}
      {arm.id === 'deliver' && <DeliverPanel />}
    </div>
  );
}

/** The centrepiece: the kraken stays put, and each scroll step brings one arm and its card. */
export function Creature() {
  const [active, setActive] = useState<number | null>(null);
  useEffect(
    () =>
      scrollStore.subscribe((p) => {
        const i = armIndexAt(p);
        setActive((old) => (old === i ? old : i));
      }),
    [],
  );
  const arm = active === null ? null : ARMS[active];
  const right = (active ?? 0) % 2 === 0;

  return (
    <Stage id="creature" fadeIn={false} fadeOut={false}>
      {arm && (
        <div
          key={arm.id}
          className={`card-in absolute inset-x-4 bottom-4 max-h-[56dvh] overflow-y-auto md:inset-x-auto md:bottom-auto md:top-1/2 md:max-h-[84dvh] md:w-[min(410px,32vw)] md:-translate-y-1/2 ${
            right ? 'md:right-[8.5vw]' : 'md:left-[6vw]'
          }`}
        >
          <ArmCard arm={arm} />
        </div>
      )}
    </Stage>
  );
}
