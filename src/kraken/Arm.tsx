import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { armAngle, armPoints, armRadius, type Vec3 } from './armCurve';
import type { KrakenState } from './state';
import type { Quality } from './quality';
import { COLORS, toonMaterial } from './toon';

const RADIAL = 10;
const SUCKERS = 7;

function tubeGeometry(segments: number): THREE.BufferGeometry {
  const rings = segments + 1;
  const g = new THREE.BufferGeometry();
  const count = rings * RADIAL + 1; // + the tip
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const idx: number[] = [];
  for (let k = 0; k < segments; k++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = k * RADIAL + j;
      const b = k * RADIAL + ((j + 1) % RADIAL);
      const c = a + RADIAL;
      const d = b + RADIAL;
      idx.push(a, b, c, b, d, c);
    }
  }
  const tip = rings * RADIAL;
  const last = segments * RADIAL;
  for (let j = 0; j < RADIAL; j++) idx.push(last + j, last + ((j + 1) % RADIAL), tip);
  g.setIndex(idx);
  return g;
}

const T = new THREE.Vector3();
const N = new THREE.Vector3();
const B = new THREE.Vector3();
const S0 = new THREE.Vector3();
const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const SC = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/** Fill a tube's vertices around the curve. `extra` thickens it (used for the ink outline). */
function fillTube(g: THREE.BufferGeometry, pts: Vec3[], side: THREE.Vector3, extra: number, normalsOut?: Vec3[]) {
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const nor = g.getAttribute('normal') as THREE.BufferAttribute;
  const n = pts.length;
  for (let k = 0; k < n; k++) {
    const a = pts[Math.max(0, k - 1)];
    const b = pts[Math.min(n - 1, k + 1)];
    T.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
    N.crossVectors(side, T).normalize(); // the arm's top side
    B.crossVectors(T, N).normalize();
    if (normalsOut) normalsOut[k] = [N.x, N.y, N.z];
    const r = armRadius(k / (n - 1)) + extra;
    for (let j = 0; j < RADIAL; j++) {
      const phi = (j / RADIAL) * Math.PI * 2;
      const cx = Math.cos(phi);
      const sx = Math.sin(phi);
      const nx = N.x * cx + B.x * sx;
      const ny = N.y * cx + B.y * sx;
      const nz = N.z * cx + B.z * sx;
      const i = k * RADIAL + j;
      pos.setXYZ(i, pts[k][0] + nx * r, pts[k][1] + ny * r, pts[k][2] + nz * r);
      nor.setXYZ(i, nx, ny, nz);
    }
  }
  const tipR = armRadius(1) + extra;
  const end = pts[n - 1];
  pos.setXYZ(n * RADIAL, end[0] + T.x * tipR * 1.7, end[1] + T.y * tipR * 1.7, end[2] + T.z * tipR * 1.7);
  nor.setXYZ(n * RADIAL, T.x, T.y, T.z);
  pos.needsUpdate = true;
  nor.needsUpdate = true;
  g.computeBoundingSphere();
}

type Props = { index: number; state: KrakenState; quality: Quality; children?: React.ReactNode };

export function Arm({ index, state, quality, children }: Props) {
  const segments = quality.armSegments;
  const geo = useMemo(() => tubeGeometry(segments), [segments]);
  const outlineGeo = useMemo(() => (quality.outline ? tubeGeometry(segments) : null), [segments, quality.outline]);
  const mat = useMemo(() => toonMaterial(COLORS.coral), []);
  const outlineMat = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.ink, side: THREE.BackSide }), []);
  const suckerMat = useMemo(() => toonMaterial(COLORS.belly), []);
  const suckerGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const suckers = useRef<THREE.InstancedMesh>(null);
  const tip = useRef<THREE.Group>(null);
  const normals = useRef<Vec3[]>([]);
  const side = useMemo(() => {
    const a = armAngle(index);
    return new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
  }, [index]);

  useFrame(({ clock }) => {
    const t = quality.loop ? clock.elapsedTime : 0;
    const isLast = index === 7;
    // The eighth arm is the visitor's: it follows the cursor fully. The others only lean a little.
    const k = isLast ? 1 : 0.2;
    const waveX = isLast ? Math.sin(t * 5.2) * 0.9 * state.wave : 0;
    const lean: [number, number] = [state.lean[0] * k + waveX, state.lean[1] * k];
    const pts = armPoints(index, t, state.poses[index], lean, segments);
    S0.copy(side);
    fillTube(geo, pts, S0, 0, normals.current);
    if (outlineGeo) fillTube(outlineGeo, pts, S0, 0.028);

    if (suckers.current) {
      for (let i = 0; i < SUCKERS; i++) {
        const s = 0.18 + (i / (SUCKERS - 1)) * 0.72;
        const kf = Math.round(s * segments);
        const p = pts[kf];
        const n = normals.current[kf];
        const r = armRadius(kf / segments);
        N.set(-n[0], -n[1], -n[2]); // underside
        P.set(p[0] + N.x * r * 0.92, p[1] + N.y * r * 0.92, p[2] + N.z * r * 0.92);
        Q.setFromUnitVectors(UP, N);
        SC.set(r * 0.42, r * 0.16, r * 0.42);
        suckers.current.setMatrixAt(i, M.compose(P, Q, SC));
      }
      suckers.current.instanceMatrix.needsUpdate = true;
    }

    if (tip.current) {
      const end = pts[segments];
      const prev = pts[segments - 2];
      T.set(end[0] - prev[0], end[1] - prev[1], end[2] - prev[2]).normalize();
      tip.current.position.set(end[0], end[1], end[2]);
      tip.current.quaternion.setFromUnitVectors(UP, T);
    }
  });

  return (
    <group>
      <mesh geometry={geo} material={mat} frustumCulled={false} />
      {outlineGeo && <mesh geometry={outlineGeo} material={outlineMat} frustumCulled={false} />}
      <instancedMesh ref={suckers} args={[suckerGeo, suckerMat, SUCKERS]} frustumCulled={false} />
      <group ref={tip}>{children}</group>
    </group>
  );
}
