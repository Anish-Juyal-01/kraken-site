// Small drawings that fill the sky and the sea. All colours come from the palette's variables.

export function Fish({ x, y, s, flip }: { x: number; y: number; s: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C 8 -9, 26 -9, 36 0 C 26 9, 8 9, 0 0 Z M36 0 L48 -8 L46 0 L48 8 Z" />
    </g>
  );
}

/** A loose shoal that drifts across the screen. */
export function Shoal({ top, seconds, delay, scale, reverse, color = 'var(--fish)' }: { top: string; seconds: number; delay: number; scale: number; reverse?: boolean; color?: string }) {
  const fish = [
    [0, 20, 1],
    [58, 4, 0.8],
    [70, 40, 0.9],
    [128, 22, 1.1],
    [150, 56, 0.7],
    [196, 8, 0.85],
    [214, 40, 1],
    [262, 26, 0.75],
  ];
  return (
    <div className={`shoal absolute ${reverse ? 'shoal-back' : ''}`} style={{ top, color, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}>
      <svg width={330 * scale} height={80 * scale} viewBox="0 0 330 80" fill="currentColor">
        {fish.map(([x, y, s], i) => (
          <Fish key={i} x={reverse ? x + 48 : x} y={y + 10} s={s} flip={reverse} />
        ))}
      </svg>
    </div>
  );
}

/** A jellyfish that pulses and drifts slowly upwards. */
export function Jelly({ left, top, size, seconds, delay, color }: { left: string; top: string; size: number; seconds: number; delay: number; color: string }) {
  return (
    <div className="jelly absolute" style={{ left, top, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}>
      <svg className="jelly-pulse" width={size} height={size * 1.5} viewBox="0 0 80 120" fill="none">
        <path d="M6 44 C 6 16, 26 4, 40 4 S 74 16, 74 44 C 66 50, 58 40, 50 46 S 34 40, 26 46 S 14 50, 6 44 Z" fill={color} fillOpacity="0.75" />
        <path d="M22 26 C 28 16, 40 12, 50 14" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 48 C 14 66, 24 78, 18 100 M32 48 C 36 68, 26 84, 32 112 M48 48 C 44 68, 54 84, 48 110 M62 48 C 66 64, 56 80, 62 98" stroke={color} strokeOpacity="0.7" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** A whale far in the background, crossing very slowly. */
export function Whale({ top, seconds, delay }: { top: string; seconds: number; delay: number }) {
  return (
    <div className="shoal absolute" style={{ top, animationDuration: `${seconds}s`, animationDelay: `${delay}s`, color: 'var(--sea-0)' }}>
      <svg width="520" height="190" viewBox="0 0 520 190" fill="currentColor" opacity="0.75">
        <path d="M70 96 C 120 30, 300 10, 420 60 C 470 82, 500 110, 506 124 C 470 150, 380 168, 280 164 C 190 160, 120 140, 70 96 Z" />
        <path d="M78 96 C 50 70, 30 62, 6 60 C 22 84, 22 104, 8 132 C 34 126, 54 114, 78 96 Z" />
        <path d="M300 160 C 310 184, 340 190, 360 180 C 344 172, 336 164, 332 156 Z" />
        <circle cx="440" cy="96" r="6" fill="var(--color-paper)" opacity="0.8" />
      </svg>
    </div>
  );
}

/** A column of bubbles rising from the sea floor. */
export function BubbleColumn({ left, delay = 0 }: { left: string; delay?: number }) {
  return (
    <div className="absolute bottom-[10vh]" style={{ left }}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="rise absolute rounded-full border-[1.5px] border-paper/60"
          style={{ width: 6 + i * 3, height: 6 + i * 3, left: (i % 2) * 10 - 5, animationDelay: `${delay - i * 1.3}s` }}
        />
      ))}
    </div>
  );
}

/** Corals, a starfish and a treasure chest for the sea floor. Drawn in one 1600 x 300 strip. */
export function Reef() {
  const branch = (x: number, h: number, c: string, k: number) => (
    <g key={k} transform={`translate(${x} 300)`} stroke={c} strokeWidth="14" strokeLinecap="round" fill="none">
      <path d={`M0 0 V${-h}`} />
      <path d={`M0 ${-h * 0.45} C -18 ${-h * 0.55}, -30 ${-h * 0.62}, -32 ${-h * 0.86}`} />
      <path d={`M0 ${-h * 0.3} C 20 ${-h * 0.42}, 30 ${-h * 0.5}, 34 ${-h * 0.74}`} />
      <path d={`M0 ${-h * 0.7} C 12 ${-h * 0.8}, 16 ${-h * 0.88}, 18 ${-h * 1.05}`} />
    </g>
  );
  return (
    <svg className="absolute inset-x-0 bottom-0 h-[30vh] w-full" viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax meet">
      {/* corals */}
      {branch(250, 120, 'var(--reef-1)', 1)}
      {branch(312, 82, 'var(--reef-2)', 2)}
      {branch(1010, 96, 'var(--reef-2)', 3)}
      {branch(1066, 132, 'var(--reef-1)', 4)}
      {branch(1490, 90, 'var(--reef-1)', 5)}
      {/* brain coral mounds */}
      <path d="M560 300 C 560 250, 600 232, 640 232 S 720 250, 720 300 Z" fill="var(--reef-2)" />
      <path d="M584 284 C 596 262, 616 258, 628 270 M648 252 C 664 258, 676 270, 684 286 M612 250 C 626 244, 640 246, 650 254" stroke="var(--color-deep)" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* a treasure chest */}
      <g transform="translate(820 226)">
        <path d="M0 26 C 0 6, 16 0, 46 0 S 92 6, 92 26 Z" fill="var(--pop)" />
        <rect x="0" y="26" width="92" height="48" rx="5" fill="var(--pop)" />
        <path d="M0 26 H92 M22 0 V74 M70 0 V74" stroke="var(--color-deep)" strokeOpacity="0.5" strokeWidth="5" />
        <rect x="38" y="20" width="16" height="18" rx="3" fill="var(--color-deep)" />
      </g>
      {/* starfish */}
      <path d="M1290 262 l8 16 18 3 -13 12 3 18 -16 -9 -16 9 3 -18 -13 -12 18 -3 Z" fill="var(--reef-1)" />
      <path d="M150 270 l6 12 13 2 -10 9 2 13 -11 -6 -12 6 3 -13 -10 -9 13 -2 Z" fill="var(--pop)" />
      {/* shells and pebbles */}
      <ellipse cx="450" cy="290" rx="20" ry="9" fill="var(--rock)" />
      <ellipse cx="1180" cy="292" rx="26" ry="10" fill="var(--rock)" />
      <ellipse cx="760" cy="294" rx="14" ry="6" fill="var(--rock)" />
    </svg>
  );
}
