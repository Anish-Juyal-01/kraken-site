import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scroll/store';
import { depthMix } from './depth';

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();

/** Bubbles that rise faster when the visitor scrolls fast. Only visible under water. */
export function Bubbles({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ece7d9', transparent: true, opacity: 0, depthWrite: false }), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
          return x - Math.floor(x);
        };
        return { x: (r(1) - 0.5) * 11, z: -4 + r(2) * 5.5, y: r(3) * 12, size: 0.025 + r(4) * 0.06, speed: 0.25 + r(5) * 0.5, phase: r(6) * 6.28 };
      }),
    [count],
  );

  useFrame(({ clock }, dt) => {
    if (!mesh.current) return;
    const boost = 1 + Math.min(6, Math.abs(scrollStore.velocity()) / 600);
    mat.opacity = 0.34 * depthMix(scrollStore.get());
    const t = clock.elapsedTime;
    for (let i = 0; i < seeds.length; i++) {
      const b = seeds[i];
      b.y = (b.y + b.speed * boost * Math.min(dt, 0.05)) % 12;
      P.set(b.x + Math.sin(t * 0.8 + b.phase) * 0.12, b.y - 6, b.z);
      S.setScalar(b.size);
      mesh.current.setMatrixAt(i, M.compose(P, Q, S));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geo, mat, count]} frustumCulled={false} />;
}
