import type { ChatMsg } from '../content/content';

/** One chat message, in the site's own style. The text is real; the frame is ours. */
export function ChatCard({ msg, children }: { msg: ChatMsg; children?: React.ReactNode }) {
  const isKraken = msg.who === 'kraken';
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--line-now)] bg-[var(--card-now)] p-4">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`grid size-7 place-items-center rounded-full text-[13px] font-bold ${isKraken ? 'bg-coral text-deep' : 'border-[1.5px] border-[var(--ink-now)]'}`}
        >
          {msg.who[0].toUpperCase()}
        </span>
        <span className="text-[14px] font-semibold">{msg.who}</span>
      </div>
      <p className="mt-2.5 font-mono text-[13.5px] leading-relaxed">{msg.text}</p>
      {msg.code && (
        <pre className="mt-3 overflow-x-auto rounded-[10px] bg-deep p-3 font-mono text-[12px] leading-relaxed text-paper">
          <code>{msg.code}</code>
        </pre>
      )}
      {msg.files && (
        <p className="mt-2 font-mono text-[12px] opacity-75">
          <span className="font-semibold">files:</span> {msg.files}
        </p>
      )}
      {msg.note && <p className="mt-2 text-[12.5px] italic opacity-80">{msg.note}</p>}
      {children}
    </div>
  );
}
