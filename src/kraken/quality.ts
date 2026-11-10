export type Quality = { mode: 'full' | 'lite' | 'still'; armSegments: number; outline: boolean; bubbles: number; loop: boolean };
export const FULL: Quality = { mode: 'full', armSegments: 24, outline: true, bubbles: 40, loop: true };
