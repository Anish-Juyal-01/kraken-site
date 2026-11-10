import * as THREE from 'three';

let gradient: THREE.DataTexture | null = null;

/** Four soft tones: storybook shading with a little more roundness than flat cel shading. */
export function toonGradient(): THREE.DataTexture {
  if (gradient) return gradient;
  const steps = [132, 196, 236, 255];
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

/** Skin that takes its colour from the geometry: coral on top, a paler belly underneath. */
export function skinMaterial(): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({ color: '#ffffff', vertexColors: true, gradientMap: toonGradient() });
}

export const COLORS = {
  coral: '#e8553d',
  coralDeep: '#c9402b',
  coralLight: '#f39a84',
  belly: '#f7cdb8',
  // The outline is a deep red-brown, not black: it reads as a drawn line without looking harsh.
  outline: '#6e2117',
  ink: '#12332d',
  iris: '#1d6b5f',
  white: '#fbf8f0',
  tongue: '#f08a9b',
};

const A = new THREE.Color();
const B = new THREE.Color();

/** Write a per-vertex colour that blends `top` into `under` by `t` (0 top .. 1 underside). */
export function setSkinColor(attr: THREE.BufferAttribute, i: number, t: number, top = COLORS.coral, under = COLORS.belly) {
  A.set(top);
  B.set(under);
  A.lerp(B, Math.min(1, Math.max(0, t)));
  attr.setXYZ(i, A.r, A.g, A.b);
}
