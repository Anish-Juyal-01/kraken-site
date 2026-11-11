const SHADE = 'color-mix(in srgb, var(--color-ink) 16%, white)';
const HAZE = 'color-mix(in srgb, var(--color-ink) 13%, var(--color-paper))';
const SAND = 'color-mix(in srgb, var(--pop) 38%, white)';
const TRUNK = 'color-mix(in srgb, var(--color-ink) 50%, var(--color-coral))';
const HILL_LIGHT = 'color-mix(in srgb, var(--kelp-1) 62%, var(--color-paper))';

/** One cloud: soft lobes on a flat base, with a tinted underside so it has some body. */
function Cloud({ width, flip }: { width: number; flip?: boolean }) {
  const lobes = (
    <>
      <rect x="18" y="52" width="204" height="30" rx="15" />
      <circle cx="46" cy="60" r="17" />
      <circle cx="78" cy="48" r="27" />
      <circle cx="122" cy="36" r="34" />
      <circle cx="166" cy="48" r="27" />
      <circle cx="198" cy="62" r="17" />
    </>
  );
  return (
    <svg width={width} height={width * 0.4} viewBox="0 0 240 96" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden>
      <g fill={SHADE} transform="translate(0 7)">
        {lobes}
      </g>
      <g fill="#ffffff">{lobes}</g>
    </svg>
  );
}

function Sun() {
  const rays = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg className="absolute right-[7%] top-[6vh] w-[15vw] min-w-[150px]" viewBox="0 0 300 300" fill="none" aria-hidden>
      <defs>
        <radialGradient id="sun-glow">
          <stop offset="0.3" style={{ stopColor: 'var(--pop)', stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: 'var(--pop)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="sun-disc" cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--pop) 55%, white)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--pop)' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--pop) 72%, var(--color-coral))' }} />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="150" fill="url(#sun-glow)" />
      <g className="sun-rays" style={{ transformOrigin: '150px 150px' }} stroke="var(--pop)" strokeLinecap="round">
        {rays.map((i) => (
          <line key={i} x1="150" y1={i % 2 ? 62 : 54} x2="150" y2="74" strokeWidth={i % 2 ? 4 : 5} opacity={i % 2 ? 0.6 : 0.9} transform={`rotate(${i * 22.5} 150 150)`} />
        ))}
      </g>
      <circle cx="150" cy="150" r="62" fill="url(#sun-disc)" />
    </svg>
  );
}

function Gull({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <g className="gull" style={{ animationDelay: `${delay}s` }}>
        <path d="M-22 2 C -16 -9, -7 -9, 0 0 C 7 -9, 16 -9, 22 2" />
      </g>
    </g>
  );
}

function Island({ horizon }: { horizon: string }) {
  return (
    <svg className="absolute left-[2%] w-[19vw] min-w-[190px]" style={{ top: horizon, transform: 'translateY(-97%)' }} viewBox="0 0 360 200" fill="none" aria-hidden>
      <defs>
        <clipPath id="tower">
          <path d="M100 140 L107 62 H131 L138 140 Z" />
        </clipPath>
        <linearGradient id="beam" x1="0" x2="1">
          <stop offset="0" style={{ stopColor: 'var(--pop)', stopOpacity: 0.5 }} />
          <stop offset="1" style={{ stopColor: 'var(--pop)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      {/* far hill, then the near one */}
      <path d="M60 200 C 100 152, 160 136, 214 144 S 318 172, 350 200 Z" fill={HILL_LIGHT} />
      <path d="M0 200 C 20 168, 60 140, 112 136 C 160 132, 196 160, 236 177 C 260 188, 282 195, 300 200 Z" fill="var(--kelp-2)" />
      <path d="M34 174 C 56 154, 84 143, 110 141" stroke="var(--kelp-1)" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      <path d="M-8 200 C 60 189, 250 189, 330 200 Z" fill={SAND} />
      <ellipse cx="304" cy="197" rx="13" ry="5" fill="var(--rock)" />
      {/* palm */}
      <path d="M232 180 C 229 160, 233 142, 242 128" stroke={TRUNK} strokeWidth="5" strokeLinecap="round" />
      <g stroke="var(--kelp-1)" strokeWidth="5.5" strokeLinecap="round">
        <path d="M242 128 Q 262 112 280 124" />
        <path d="M242 128 Q 264 126 272 144" />
        <path d="M242 128 Q 226 108 208 118" />
        <path d="M242 128 Q 224 124 218 142" />
        <path d="M242 128 Q 244 108 254 100" />
      </g>
      {/* lighthouse */}
      <path d="M130 47 L360 14 V84 Z" fill="url(#beam)" />
      <g clipPath="url(#tower)">
        <rect x="96" y="60" width="46" height="82" fill="#ffffff" />
        <rect x="96" y="78" width="46" height="15" fill="var(--color-coral)" />
        <rect x="96" y="110" width="46" height="15" fill="var(--color-coral)" />
        <rect x="120" y="60" width="22" height="82" fill="var(--color-ink)" opacity="0.13" />
      </g>
      <path d="M114 140 V128 a5 5 0 0 1 10 0 V140 Z" fill="var(--color-ink)" />
      <rect x="100" y="56" width="38" height="7" rx="2.5" fill="var(--color-ink)" />
      <rect x="108" y="38" width="22" height="18" rx="2" fill="var(--pop)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <path d="M119 38 V56" stroke="var(--color-ink)" strokeWidth="2" />
      <path d="M103 38 Q 119 16 135 38 Z" fill="var(--color-coral)" />
      <path d="M119 24 V15" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Boat({ horizon }: { horizon: string }) {
  return (
    <div className="buoy buoy-c absolute right-[7%]" style={{ top: horizon, transform: 'translateY(-91%)' }}>
      <svg className="w-[8.5vw] min-w-[96px]" viewBox="0 0 220 200" fill="none" aria-hidden>
        <path d="M108 14 V152" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M108 14 L130 21 L108 28 Z" fill="var(--pop)" />
        {/* mainsail with a shaded luff and two seams */}
        <path d="M114 26 C 150 62, 173 100, 182 140 H114 Z" fill="#ffffff" />
        <path d="M114 26 C 127 62, 131 100, 131 140 H114 Z" fill="var(--color-ink)" opacity="0.1" />
        <path d="M114 78 H157 M114 110 H172" stroke="var(--color-ink)" strokeWidth="1.5" opacity="0.2" />
        {/* jib */}
        <path d="M102 42 C 82 76, 62 108, 44 140 H102 Z" fill="var(--color-coral)" />
        <path d="M102 42 C 96 78, 92 110, 88 140 H102 Z" fill="#ffffff" opacity="0.22" />
        {/* hull */}
        <path d="M22 152 H198 C 191 174, 173 186, 150 186 H70 C 47 186, 29 174, 22 152 Z" fill="var(--color-ink)" />
        <path d="M34 163 H186" stroke="var(--color-paper)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** The sky above the first screen: sun, clouds, gulls, a far coast, an island with a lighthouse, a boat. */
export function Sky({ horizon }: { horizon: string }) {
  return (
    <>
      <Sun />
      {/* a hazy coast on the far horizon, for depth */}
      <svg className="absolute right-0 h-[9vh] w-[46vw]" style={{ top: horizon, transform: 'translateY(-98%)' }} viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0 120 C 90 96, 150 70, 230 78 C 300 84, 330 40, 420 36 C 500 32, 540 74, 620 62 C 700 50, 750 22, 800 18 V120 Z" fill={HAZE} />
      </svg>
      {[
        { top: '9vh', w: 230, s: 80, d: -12 },
        { top: '23vh', w: 150, s: 110, d: -62, flip: true },
        { top: '4vh', w: 170, s: 135, d: -96, flip: true },
        { top: '16vh', w: 110, s: 150, d: -30 },
      ].map((c, i) => (
        <div key={i} className="shoal absolute" style={{ top: c.top, animationDuration: `${c.s}s`, animationDelay: `${c.d}s`, opacity: i === 3 ? 0.7 : 0.96 }}>
          <Cloud width={c.w} flip={c.flip} />
        </div>
      ))}
      <svg className="buoy absolute left-[15%] top-[14vh] w-[11vw] min-w-[120px]" viewBox="0 0 180 80" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <Gull x={40} y={26} size={1} delay={0} />
        <Gull x={104} y={48} size={0.72} delay={-0.4} />
        <Gull x={150} y={20} size={0.5} delay={-0.75} />
      </svg>
      <Island horizon={horizon} />
      <Boat horizon={horizon} />
    </>
  );
}
