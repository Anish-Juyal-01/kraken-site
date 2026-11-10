import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mood } from './moods';
import { COLORS, toonMaterial } from './toon';

const EYE_R = 0.275;
const EYES: [number, number, number][] = [
  [-0.37, 0.36, 0.8],
  [0.37, 0.36, 0.8],
];

type Props = { mood: React.MutableRefObject<Mood>; look: () => [number, number]; animate: boolean };

/** Two big eyes: iris and pupil follow `look`, lids close with the mood and blink on their own. */
export function Eyes({ mood, look, animate }: Props) {
  const white = useMemo(() => toonMaterial(COLORS.white), []);
  const rim = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.outline }), []);
  const iris = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.iris }), []);
  const pupil = useMemo(() => new THREE.MeshBasicMaterial({ color: '#06120f' }), []);
  const shine = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff' }), []);
  const lidMat = useMemo(() => toonMaterial(COLORS.coralDeep), []);
  const ball = useMemo(() => new THREE.SphereGeometry(1, 32, 24), []);
  const lidGeo = useMemo(() => new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const gaze = useRef<(THREE.Group | null)[]>([]);
  const irises = useRef<(THREE.Mesh | null)[]>([]);
  const pupils = useRef<(THREE.Mesh | null)[]>([]);
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
      gaze.current[i]?.position.set(lx * 0.095, ly * 0.085, 0);
      // scale the iris and pupil in place; scaling the group would pull them inside the eyeball
      irises.current[i]?.scale.set(0.165 * (0.85 + m.pupil * 0.15), 0.18 * (0.85 + m.pupil * 0.15), 0.04);
      pupils.current[i]?.scale.set(0.1 * m.pupil, 0.112 * m.pupil, 0.04);
      const l = lids.current[i];
      // The lid is the top half of a sphere, tipped back out of sight when open.
      if (l) l.rotation.x = -1.8 + lid * 1.9;
    }
  });

  return (
    <group>
      {EYES.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh geometry={ball} material={rim} scale={EYE_R + 0.018} position={[0, 0, -0.04]} />
          <mesh geometry={ball} material={white} scale={EYE_R} />
          <group ref={(g) => (gaze.current[i] = g)}>
            <mesh ref={(m) => (irises.current[i] = m)} geometry={ball} material={iris} position={[0, 0, EYE_R - 0.03]} />
            <mesh ref={(m) => (pupils.current[i] = m)} geometry={ball} material={pupil} position={[0, 0, EYE_R - 0.012]} />
            <mesh geometry={ball} material={shine} scale={[0.05, 0.055, 0.02]} position={[0.055, 0.07, EYE_R + 0.03]} />
            <mesh geometry={ball} material={shine} scale={[0.022, 0.024, 0.02]} position={[-0.05, -0.05, EYE_R + 0.03]} />
          </group>
          <mesh ref={(m) => (lids.current[i] = m)} geometry={lidGeo} material={lidMat} scale={EYE_R + 0.03} />
        </group>
      ))}
    </group>
  );
}
