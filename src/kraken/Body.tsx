import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mood } from './moods';
import { Eyes } from './Eyes';
import { COLORS, toonMaterial } from './toon';

type Props = { mood: React.MutableRefObject<Mood>; look: () => [number, number]; outline: boolean; animate: boolean };

/** The round head with its face. Squashes and stretches with the mood. */
export function Body({ mood, look, outline, animate }: Props) {
  const skin = useMemo(() => toonMaterial(COLORS.coral), []);
  const blush = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.coralLight, transparent: true, opacity: 0.85 }), []);
  const spot = useMemo(() => toonMaterial(COLORS.coralLight), []);
  const dark = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.ink }), []);
  const tongueMat = useMemo(() => toonMaterial(COLORS.tongue), []);
  const outlineMat = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.ink, side: THREE.BackSide }), []);
  const ball = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  const smileGeo = useMemo(() => new THREE.TorusGeometry(0.13, 0.026, 10, 24, Math.PI), []);
  const head = useRef<THREE.Group>(null);
  const smile = useRef<THREE.Mesh>(null);
  const oh = useRef<THREE.Mesh>(null);
  const tongue = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const m = mood.current;
    const breathe = animate ? Math.sin(clock.elapsedTime * 1.6) * 0.012 : 0;
    const sq = m.squash + breathe;
    const wide = 1 / Math.sqrt(sq);
    head.current?.scale.set(1.06 * wide, 0.94 * sq, 1.0 * wide);
    if (smile.current) {
      const s = Math.max(0, m.mouth);
      smile.current.visible = m.mouth > -0.25;
      smile.current.scale.set(0.7 + s * 0.5, 0.25 + s * 0.95, 1);
    }
    if (oh.current) {
      const o = Math.max(0, -m.mouth);
      oh.current.visible = o > 0.05;
      oh.current.scale.set(0.085 * o, 0.11 * o, 0.03);
    }
    if (tongue.current) {
      tongue.current.visible = m.tongue > 0.05;
      tongue.current.scale.setScalar(0.07 * m.tongue);
    }
  });

  return (
    <group ref={head} position={[0, 0.35, 0]}>
      <mesh geometry={ball} material={skin} />
      {outline && <mesh geometry={ball} material={outlineMat} scale={1.03} />}
      {/* a few lighter spots on the crown */}
      <mesh geometry={ball} material={spot} scale={[0.16, 0.05, 0.16]} position={[-0.38, 0.9, 0.12]} rotation={[0.1, 0, 0.42]} />
      <mesh geometry={ball} material={spot} scale={[0.1, 0.04, 0.1]} position={[-0.12, 0.985, 0.1]} rotation={[0.1, 0, 0.12]} />
      <mesh geometry={ball} material={spot} scale={[0.12, 0.045, 0.12]} position={[0.42, 0.88, 0.16]} rotation={[0.15, 0, -0.45]} />
      {/* cheeks */}
      <mesh geometry={ball} material={blush} scale={[0.15, 0.09, 0.04]} position={[-0.66, 0.08, 0.735]} rotation={[0, -0.72, 0]} />
      <mesh geometry={ball} material={blush} scale={[0.15, 0.09, 0.04]} position={[0.66, 0.08, 0.735]} rotation={[0, 0.72, 0]} />
      <Eyes mood={mood} look={look} animate={animate} />
      <mesh ref={smile} geometry={smileGeo} material={dark} position={[0, 0.1, 0.985]} rotation={[0.08, 0, Math.PI]} />
      <mesh ref={oh} geometry={ball} material={dark} position={[0, 0.03, 0.992]} />
      <mesh ref={tongue} geometry={ball} material={tongueMat} position={[0.09, -0.02, 0.985]} />
    </group>
  );
}
