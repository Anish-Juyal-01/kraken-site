// How much 3D a device gets. Pure, so every rule is tested.
export type Quality = { mode: 'full' | 'lite' | 'still' | 'none'; armSegments: number; outline: boolean; bubbles: number; loop: boolean };
export type Device = { width: number; reducedMotion: boolean; webgl: boolean; cores: number };

export const FULL: Quality = { mode: 'full', armSegments: 24, outline: true, bubbles: 40, loop: true };
const LITE: Quality = { mode: 'lite', armSegments: 12, outline: false, bubbles: 12, loop: true };
const STILL: Quality = { mode: 'still', armSegments: 24, outline: true, bubbles: 0, loop: false };
const NONE: Quality = { mode: 'none', armSegments: 0, outline: false, bubbles: 0, loop: false };

export function qualityFor(d: Device): Quality {
  if (!d.webgl) return NONE; // the page still shows all its content, without the creature
  if (d.reducedMotion) return STILL; // one drawn frame per section, no camera travel, no loop
  if (!(d.width >= 768) || !(d.cores > 4)) return LITE;
  return FULL;
}

/** Read the real device once. */
export function detectDevice(): Device {
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  return {
    width: window.innerWidth,
    // ?motion=reduce previews the reduced-motion page without changing a system setting
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('motion') === 'reduce',
    webgl,
    cores: navigator.hardwareConcurrency || 4,
  };
}
