import { useEffect, useRef } from 'react';
import { scrollStore } from '../scroll/store';
import { waterTop } from '../kraken/camera';
import { depthColor, depthMix, inkColor } from '../kraken/depth';

/** The sea surface: a sheet of water that rises over the screen as you dive. It also writes
 *  the background and ink colours of the page, which change once with depth. */
export function Water() {
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      scrollStore.subscribe((p) => {
        const root = document.documentElement.style;
        const deep = depthMix(p) > 0.5;
        root.setProperty('--bg-now', depthColor(p));
        root.setProperty('--ink-now', inkColor(p));
        root.setProperty('--card-now', deep ? 'rgba(236, 231, 217, 0.07)' : 'rgba(255, 255, 255, 0.6)');
        root.setProperty('--line-now', deep ? 'rgba(236, 231, 217, 0.22)' : 'rgba(18, 51, 45, 0.18)');
        if (sheet.current) {
          sheet.current.style.transform = `translate3d(0, ${waterTop(p)}vh, 0)`;
          sheet.current.style.opacity = String(1 - depthMix(p));
        }
      }),
    [],
  );
  return (
    <div ref={sheet} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-[130vh] will-change-transform">
      <svg className="absolute -top-[23px] left-0 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none">
        <path
          d="M0 14 C 50 2, 100 2, 150 14 S 250 26, 300 14 S 400 2, 450 14 S 550 26, 600 14 S 700 2, 750 14 S 850 26, 900 14 S 1000 2, 1050 14 S 1150 26, 1200 14 V24 H0 Z"
          fill="#0b2420"
          fillOpacity="0.8"
        />
      </svg>
      <div className="h-full w-full bg-deep/80" />
    </div>
  );
}
