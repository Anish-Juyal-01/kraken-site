import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mood } from './moods';
import { COLORS, toonMaterial } from './toon';

const EYE_R = 0.27;
const EYES: [number, number, number][] = [
  [-0.37, 0.36, 0.8],
  [0.37, 0.36, 0.8],
];

type Props = { mood: React.MutableRefObject<Mood>; look: () => [number, number]; animate: boolean };

/** Two big eyes: pupils follow `look`, lids close with the mood and blink on their own. */
export function Eyes({ mood, look, animate }: Props) {
  const white = useMemo(() => toonMaterial(COLORS.white), []);
  const dark = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.ink }), []);
  const shine = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff' }), []);
  const lidMat = useMemo(() => toonMaterial(COLORS.coral), []);
  const ball = useMemo(() => new THREE.SphereGeometry(1, 28, 20), []);
  const lidGeo = useMemo(() => new THREE.SphereGeometry(1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const pupils = useRef<(THREE.Group | null)[]>([]);
  const lids = useRef<(THREE.Mesh | null)[]>([]);
  const blink = useRef({ next: 2.5, t: -1 });

  useFrame(({ clock }, dt) => {
    const now = clock.elapsedTime;
    const b = blink.current;
    if (animate && b.t < 0 && now > b.next) b.t = 0;
    let blinkAmt = 0;
    if (b.t >= 0) {
      b.t += dt;
      blinkAmt = Math.sin(Math.min(1, b.t / 0.16) * Math.PI);
      if (b.t > 0.16) {
        b.t = -1;
        b.next = now + 3 + Math.random() * 3;
      }
    }
    const m = mood.current;
    const lid = Math.min(1, m.lid + blinkAmt);
    const [lx, ly] = look();
    for (let i = 0; i < 2; i++) {
      const p = pupils.current[i];
      if (p) {
        p.position.set(lx * 0.1, ly * 0.09, 0);
        // scale the pupil in place: scaling the whole group would pull it inside the eyeball
        p.children[0].scale.set(0.135 * m.pupil, 0.15 * m.pupil, 0.05);
      }
      const l = lids.current[i];
      // The lid is the top half of a sphere, tipped back out of sight when open.
      if (l) l.rotation.x = -1.8 + lid * 1.9;
    }
  });

  return (
    <group>
      {EYES.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh geometry={ball} material={dark} scale={EYE_R + 0.02} position={[0, 0, -0.045]} />
          <mesh geometry={ball} material={white} scale={EYE_R} />
          <group ref={(g) => (pupils.current[i] = g)}>
            <mesh geometry={ball} material={dark} scale={[0.135, 0.15, 0.05]} position={[0, 0, EYE_R - 0.012]} />
            <mesh geometry={ball} material={shine} scale={0.042} position={[0.045, 0.06, EYE_R + 0.03]} />
          </group>
          <mesh ref={(m) => (lids.current[i] = m)} geometry={lidGeo} material={lidMat} scale={EYE_R + 0.03} />
        </group>
      ))}
    </group>
  );
}
