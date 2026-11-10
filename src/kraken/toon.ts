import * as THREE from 'three';

let gradient: THREE.DataTexture | null = null;

/** Three flat tones: storybook shading, no gloss. */
export function toonGradient(): THREE.DataTexture {
  if (gradient) return gradient;
  const steps = [150, 215, 255];
  const data = new Uint8Array(steps.flatMap((v) => [v, v, v, 255]));
  gradient = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

export function toonMaterial(color: string): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({ color, gradientMap: toonGradient() });
}

export const COLORS = {
  coral: '#e8553d',
  coralLight: '#f39a84',
  belly: '#f6d2bf',
  ink: '#12332d',
  white: '#fbf8f0',
  tongue: '#f08a9b',
};
