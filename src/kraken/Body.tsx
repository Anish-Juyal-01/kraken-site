import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Look } from './looks';
import type { Mood } from './moods';
import { Eyes } from './Eyes';
import { COLORS, lookMaterial, setSkinColor, skinMaterial } from './toon';

type Props = { look: Look; mood: React.MutableRefObject<Mood>; gazeAt: () => [number, number]; outline: boolean; animate: boolean };

/** Where the head's surface is, for a point of the unit sphere. Shared by the geometry and by
 *  anything that has to sit on the head (eyes, mouth, cheeks). */
function shape(look: Look, x: number, y: number, z: number): [number, number, number] {
  const h = look.head;
  const up = Math.max(0, y);
  const ny = y > 0 ? y * h.height : y * 0.92;
  // towards the crown: narrower, and (for a pointed hood) pinched to a tip
  const narrow = 1 - up * up * h.narrow - Math.pow(up, 3) * h.point * 0.5;
  return [x * narrow * h.wide, ny, z * narrow - up * up * h.lean];
}

function headGeometry(look: Look): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, 64, 48);
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const col = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const p = shape(look, pos.getX(i), y, pos.getZ(i));
    pos.setXYZ(i, p[0], p[1], p[2]);
    // only the chin and underside go pale: starting higher drew a stripe across the face
    const under = Math.min(1, Math.max(0, (-y - 0.5) / 0.45));
    setSkinColor(col, i, under * look.bellyAmount, look.skin, look.belly);
  }
  g.setAttribute('color', col);
  g.computeVertexNormals();
  return g;
}

/** z of the head's front surface at face position (x, y), so features sit on the skin. */
function faceZ(look: Look, x: number, y: number): number {
  const sx = x / look.head.wide;
  const sy = y > 0 ? y / look.head.height : y / 0.92;
  const z = Math.sqrt(Math.max(0.05, 1 - sx * sx - sy * sy));
  return shape(look, sx, sy, z)[2];
}

/** The head with its face. Squashes and stretches with the mood and leans towards the cursor. */
export function Body({ look, mood, gazeAt, outline, animate }: Props) {
  const skin = useMemo(() => skinMaterial(look), [look]);
  const blush = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f9a08e', transparent: true, opacity: look.blush, depthWrite: false }), [look]);
  const spot = useMemo(() => lookMaterial(look, COLORS.coralLight), [look]);
  const dark = useMemo(() => new THREE.MeshBasicMaterial({ color: look.outline ?? '#4a1a12' }), [look]);
  const gloss = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: look.gloss, depthWrite: false }), [look]);
  const tongueMat = useMemo(() => lookMaterial(look, COLORS.tongue), [look]);
  const finMat = useMemo(() => lookMaterial(look, look.skinDeep), [look]);
  const outlineMat = useMemo(() => new THREE.MeshBasicMaterial({ color: look.outline ?? '#000000', side: THREE.BackSide }), [look]);
  const headGeo = useMemo(() => headGeometry(look), [look]);
  const ball = useMemo(() => new THREE.SphereGeometry(1, 32, 24), []);
  const smileGeo = useMemo(() => new THREE.TorusGeometry(0.13, 0.024, 10, 28, Math.PI), []);
  const head = useRef<THREE.Group>(null);
  const smile = useRef<THREE.Mesh>(null);
  const oh = useRef<THREE.Mesh>(null);
  const tongue = useRef<THREE.Mesh>(null);
  const fins = useRef<(THREE.Group | null)[]>([]);

  const eyeZ = faceZ(look, look.eyes.x, look.eyes.y) - (look.eyes.style === 'dot' ? 0.0 : look.eyes.r * 0.62);
  const mouthY = look.mouth.y;
  const mouthZ = faceZ(look, 0, mouthY) - 0.012;
  const cheekX = Math.min(0.8, look.eyes.x + look.eyes.r + 0.14) * look.head.wide * 0.92;
  const cheekY = look.eyes.y - look.eyes.r - 0.06;
  const cheekZ = faceZ(look, cheekX, cheekY) - 0.01;
  const top = look.head.height;
  const showOutline = outline && look.outline !== null && look.outlineWidth > 0;

  useFrame(({ clock }) => {
    const m = mood.current;
    const t = clock.elapsedTime;
    const breathe = animate ? Math.sin(t * 1.6) * 0.012 : 0;
    const sq = m.squash + breathe;
    const wide = 1 / Math.sqrt(sq);
    const [lx, ly] = gazeAt();
    if (head.current) {
      head.current.scale.set(1.04 * wide, 0.96 * sq, wide);
      head.current.rotation.set(-ly * 0.07, lx * 0.12, -lx * 0.05); // a small, curious tilt
    }
    if (smile.current) {
      const s = Math.max(0, m.mouth);
      smile.current.visible = m.mouth > -0.25;
      smile.current.scale.set((0.7 + s * 0.5) * look.mouth.size, (0.25 + s * 0.95) * look.mouth.size, 1);
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
    // ear fins flap slowly; faster when startled
    const flap = animate ? Math.sin(t * (2.2 + (1 - m.pupil) * 6)) * 0.28 : 0;
    fins.current.forEach((f, i) => {
      if (f) f.rotation.z = (i === 0 ? 1 : -1) * (0.35 + flap);
    });
  });

  return (
    <group ref={head} position={[0, 0.35, 0]}>
      <mesh geometry={headGeo} material={skin} />
      {showOutline && <mesh geometry={headGeo} material={outlineMat} scale={1 + look.outlineWidth * 1.6} />}

      {look.fins === 'ears' &&
        [-1, 1].map((side, i) => (
          <group key={side} ref={(g) => (fins.current[i] = g)} position={[side * 0.86 * look.head.wide, top * 0.62, -0.05]}>
            <mesh geometry={ball} material={finMat} scale={[0.34, 0.2, 0.07]} position={[side * 0.26, 0.06, 0]} />
            {showOutline && <mesh geometry={ball} material={outlineMat} scale={[0.36, 0.22, 0.09]} position={[side * 0.26, 0.06, 0]} />}
          </group>
        ))}
      {look.fins === 'crown' &&
        [-1, 1].map((side, i) => (
          <group key={side} ref={(g) => (fins.current[i] = g)} position={[side * 0.52, top * 0.62, -0.3]}>
            <mesh geometry={ball} material={finMat} scale={[0.4, 0.17, 0.05]} position={[side * 0.3, 0.1, 0]} rotation={[0, 0, side * 0.75]} />
            {showOutline && (
              <mesh geometry={ball} material={outlineMat} scale={[0.42, 0.19, 0.07]} position={[side * 0.3, 0.1, 0]} rotation={[0, 0, side * 0.75]} />
            )}
          </group>
        ))}

      {look.spots && (
        <>
          <mesh geometry={ball} material={spot} scale={[0.15, 0.05, 0.13]} position={[-0.36, top * 0.86, faceZ(look, -0.36, top * 0.86) - 0.03]} rotation={[-0.5, 0, 0.5]} />
          <mesh geometry={ball} material={spot} scale={[0.08, 0.04, 0.08]} position={[-0.1, top * 0.94, faceZ(look, -0.1, top * 0.94) - 0.03]} rotation={[-0.7, 0, 0.1]} />
          <mesh geometry={ball} material={spot} scale={[0.11, 0.045, 0.1]} position={[0.36, top * 0.85, faceZ(look, 0.36, top * 0.85) - 0.03]} rotation={[-0.5, 0, -0.5]} />
        </>
      )}
      {look.gloss > 0 && (
        <mesh geometry={ball} material={gloss} scale={[0.19, 0.08, 0.03]} position={[-0.46, top * 0.62, faceZ(look, -0.46, top * 0.62) + 0.01]} rotation={[-0.5, -0.55, 0.5]} />
      )}
      {look.blush > 0 &&
        [-1, 1].map((side) => (
          <mesh key={side} geometry={ball} material={blush} scale={[0.13, 0.075, 0.03]} position={[side * cheekX, cheekY, cheekZ]} rotation={[0, side * 0.7, 0]} />
        ))}

      <Eyes look={look} mood={mood} gazeAt={gazeAt} animate={animate} z={eyeZ} />
      <mesh ref={smile} geometry={smileGeo} material={dark} position={[0, mouthY, mouthZ]} rotation={[0.08, 0, Math.PI]} />
      <mesh ref={oh} geometry={ball} material={dark} position={[0, mouthY - 0.06, mouthZ]} />
      <mesh ref={tongue} geometry={ball} material={tongueMat} position={[0.08 * look.mouth.size, mouthY - 0.11 * look.mouth.size, mouthZ]} />
    </group>
  );
}
