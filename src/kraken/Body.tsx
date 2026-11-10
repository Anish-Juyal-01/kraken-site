import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mood } from './moods';
import { Eyes } from './Eyes';
import { COLORS, setSkinColor, skinMaterial, toonMaterial } from './toon';

type Props = { mood: React.MutableRefObject<Mood>; look: () => [number, number]; outline: boolean; animate: boolean };

/** The head: a sphere pulled into a taller, slightly backward-leaning mantle, with a paler chin. */
function headGeometry(): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, 64, 48);
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const col = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const up = Math.max(0, y);
    // taller on top, leaning back a little, and a touch narrower towards the crown
    const ny = y > 0 ? y * 1.1 : y * 0.92;
    const narrow = 1 - up * up * 0.05;
    pos.setXYZ(i, x * narrow, ny, z * narrow - up * up * 0.12);
    // paler underneath and on the lower face, like a belly
    const under = Math.min(1, Math.max(0, (-y - 0.25) / 0.6));
    setSkinColor(col, i, under * 0.75);
  }
  g.setAttribute('color', col);
  g.computeVertexNormals();
  return g;
}

/** The head with its face. Squashes and stretches with the mood and leans towards the cursor. */
export function Body({ mood, look, outline, animate }: Props) {
  const skin = useMemo(() => skinMaterial(), []);
  const blush = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f7a08c', transparent: true, opacity: 0.8, depthWrite: false }), []);
  const spot = useMemo(() => toonMaterial(COLORS.coralLight), []);
  const dark = useMemo(() => new THREE.MeshBasicMaterial({ color: '#3a120c' }), []);
  const gloss = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.42, depthWrite: false }), []);
  const tongueMat = useMemo(() => toonMaterial(COLORS.tongue), []);
  const outlineMat = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.outline, side: THREE.BackSide }), []);
  const headGeo = useMemo(() => headGeometry(), []);
  const ball = useMemo(() => new THREE.SphereGeometry(1, 32, 24), []);
  const smileGeo = useMemo(() => new THREE.TorusGeometry(0.13, 0.024, 10, 28, Math.PI), []);
  const head = useRef<THREE.Group>(null);
  const smile = useRef<THREE.Mesh>(null);
  const oh = useRef<THREE.Mesh>(null);
  const tongue = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const m = mood.current;
    const breathe = animate ? Math.sin(clock.elapsedTime * 1.6) * 0.012 : 0;
    const sq = m.squash + breathe;
    const wide = 1 / Math.sqrt(sq);
    const [lx, ly] = look();
    if (head.current) {
      head.current.scale.set(1.06 * wide, 0.94 * sq, 1.0 * wide);
      head.current.rotation.set(-ly * 0.07, lx * 0.12, -lx * 0.05); // a small, curious tilt
    }
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
      <mesh geometry={headGeo} material={skin} />
      {outline && <mesh geometry={headGeo} material={outlineMat} scale={1.022} />}
      {/* lighter spots on the crown */}
      <mesh geometry={ball} material={spot} scale={[0.17, 0.05, 0.15]} position={[-0.4, 0.93, 0.04]} rotation={[0.2, 0, 0.5]} />
      <mesh geometry={ball} material={spot} scale={[0.09, 0.04, 0.09]} position={[-0.13, 1.05, -0.0]} rotation={[0.2, 0, 0.14]} />
      <mesh geometry={ball} material={spot} scale={[0.12, 0.045, 0.11]} position={[0.42, 0.92, 0.06]} rotation={[0.2, 0, -0.5]} />
      <mesh geometry={ball} material={spot} scale={[0.06, 0.03, 0.06]} position={[0.2, 1.035, 0.02]} rotation={[0.2, 0, -0.2]} />
      {/* a soft highlight, the way a picture-book would paint a shiny head */}
      <mesh geometry={ball} material={gloss} scale={[0.2, 0.085, 0.03]} position={[-0.5, 0.7, 0.53]} rotation={[-0.55, -0.6, 0.5]} />
      <mesh geometry={ball} material={gloss} scale={[0.05, 0.035, 0.02]} position={[-0.25, 0.82, 0.55]} rotation={[-0.6, -0.3, 0.4]} />
      {/* cheeks */}
      <mesh geometry={ball} material={blush} scale={[0.15, 0.085, 0.03]} position={[-0.67, 0.07, 0.745]} rotation={[0, -0.72, 0]} />
      <mesh geometry={ball} material={blush} scale={[0.15, 0.085, 0.03]} position={[0.67, 0.07, 0.745]} rotation={[0, 0.72, 0]} />
      <Eyes mood={mood} look={look} animate={animate} />
      <mesh ref={smile} geometry={smileGeo} material={dark} position={[0, 0.1, 0.99]} rotation={[0.08, 0, Math.PI]} />
      <mesh ref={oh} geometry={ball} material={dark} position={[0, 0.03, 0.995]} />
      <mesh ref={tongue} geometry={ball} material={tongueMat} position={[0.09, -0.02, 0.988]} />
    </group>
  );
}
