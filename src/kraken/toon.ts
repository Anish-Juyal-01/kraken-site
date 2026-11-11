import * as THREE from 'three';
import type { Look } from './looks';

const gradients = new Map<string, THREE.DataTexture>();

/** A stepped light ramp. Fewer, harder steps look flat and graphic; more steps look rounder. */
export function toonGradient(steps: number[]): THREE.DataTexture {
  const key = steps.join(',');
  const hit = gradients.get(key);
  if (hit) return hit;
  const data = new Uint8Array(steps.flatMap((v) => [v, v, v, 255]));
  const tex = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  gradients.set(key, tex);
  return tex;
}

const DEFAULT_STEPS = [132, 196, 236, 255];

/** A plain coloured material in the look's shading style. */
export function lookMaterial(look: Look | null, color: string): THREE.Material {
  if (look?.shade === 'clay') return new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 });
  return new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(look ? (look.shade as number[]) : DEFAULT_STEPS) });
}

/** Skin that takes its colour from the geometry: the look's skin on top, its belly underneath. */
export function skinMaterial(look: Look): THREE.Material {
  if (look.shade === 'clay') return new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.92 });
  return new THREE.MeshToonMaterial({ color: '#ffffff', vertexColors: true, gradientMap: toonGradient(look.shade) });
}

export function toonMaterial(color: string): THREE.Material {
  return lookMaterial(null, color);
}

export const COLORS = {
  coralLight: '#f39a84',
  ink: '#12332d',
  white: '#fbf8f0',
  tongue: '#f08a9b',
};

const A = new THREE.Color();
const B = new THREE.Color();

/** Write a per-vertex colour that blends `top` into `under` by `t` (0 top .. 1 underside). */
export function setSkinColor(attr: THREE.BufferAttribute, i: number, t: number, top: string, under: string) {
  A.set(top);
  B.set(under);
  A.lerp(B, Math.min(1, Math.max(0, t)));
  attr.setXYZ(i, A.r, A.g, A.b);
}
