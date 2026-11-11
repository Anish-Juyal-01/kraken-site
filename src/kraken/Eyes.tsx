import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Look } from './looks';
import type { Mood } from './moods';
import { COLORS, lookMaterial } from './toon';

type Props = { look: Look; mood: React.MutableRefObject<Mood>; gazeAt: () => [number, number]; animate: boolean; z: number };

/** Two eyes in the look's style. The gaze follows `gazeAt`; lids (where the look has them) close
 *  with the mood and blink. Looks without lids blink by squashing the eye flat. */
export function Eyes({ look, mood, gazeAt, animate, z }: Props) {
  const e = look.eyes;
  const white = useMemo(() => lookMaterial(look, COLORS.white), [look]);
  const rim = useMemo(() => new THREE.MeshBasicMaterial({ color: look.outline ?? look.skinDeep }), [look]);
  const iris = useMemo(() => new THREE.MeshBasicMaterial({ color: e.iris }), [e.iris]);
  const pupil = useMemo(() => new THREE.MeshBasicMaterial({ color: '#0a0f0e' }), []);
  const shine = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff' }), []);
  const lidMat = useMemo(() => lookMaterial(look, look.skinDeep), [look]);
  const ball = useMemo(() => new THREE.SphereGeometry(1, 32, 24), []);
  const lidGeo = useMemo(() => new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const eyes = useRef<(THREE.Group | null)[]>([]);
  const gaze = useRef<(THREE.Group | null)[]>([]);
  const irises = useRef<(THREE.Mesh | null)[]>([]);
  const pupils = useRef<(THREE.Mesh | null)[]>([]);
  const lids = useRef<(THREE.Mesh | null)[]>([]);
  const blink = useRef({ next: 2.5, t: -1 });
  const r = e.r;
  const flat = e.style === 'dot' || e.style === 'button'; // no white eyeball

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
    const [lx, ly] = gazeAt();
    for (let i = 0; i < 2; i++) {
      const travel = flat ? r * 0.35 : r * 0.36;
      gaze.current[i]?.position.set(lx * travel, ly * travel * 0.9, 0);
      irises.current[i]?.scale.set(r * 0.6 * (0.85 + m.pupil * 0.15), r * 0.66 * (0.85 + m.pupil * 0.15), 0.04);
      const ps = e.style === 'sticker' ? 0.62 : 0.37;
      pupils.current[i]?.scale.set(r * ps * (0.6 + m.pupil * 0.4), r * ps * 1.12 * (0.6 + m.pupil * 0.4), 0.04);
      const l = lids.current[i];
      if (l) l.rotation.x = -1.8 + lid * 1.9; // the lid is a half sphere, tipped back when open
      // lidless eyes close by squashing
      if (!e.lids) eyes.current[i]?.scale.set(1, Math.max(0.12, 1 - lid * 0.9) * (0.8 + m.pupil * 0.2), 1);
    }
  });

  return (
    <group>
      {[-1, 1].map((side, i) => (
        <group key={side} ref={(g) => (eyes.current[i] = g)} position={[side * e.x, e.y, z]}>
          {!flat && <mesh geometry={ball} material={rim} scale={r + (look.outlineWidth > 0.03 ? 0.035 : 0.018)} position={[0, 0, -0.04]} />}
          {!flat && <mesh geometry={ball} material={white} scale={r} />}
          <group ref={(g) => (gaze.current[i] = g)}>
            {e.style === 'iris' && <mesh ref={(m) => (irises.current[i] = m)} geometry={ball} material={iris} position={[0, 0, r - 0.03]} />}
            {(e.style === 'iris' || e.style === 'sticker') && (
              <mesh ref={(m) => (pupils.current[i] = m)} geometry={ball} material={pupil} position={[0, 0, r - 0.012]} />
            )}
            {e.style === 'dot' && <mesh geometry={ball} material={iris} scale={[r, r * 1.18, r * 0.5]} />}
            {e.style === 'button' && <mesh geometry={ball} material={iris} scale={r} />}
            <mesh
              geometry={ball}
              material={shine}
              scale={[r * 0.2, r * 0.22, 0.02]}
              position={[r * 0.22, r * 0.28, flat ? r * 0.52 : r + 0.03]}
            />
            {e.style !== 'dot' && (
              <mesh geometry={ball} material={shine} scale={[r * 0.09, r * 0.1, 0.02]} position={[-r * 0.2, -r * 0.2, flat ? r * 0.98 : r + 0.03]} />
            )}
          </group>
          {e.lids && <mesh ref={(m) => (lids.current[i] = m)} geometry={lidGeo} material={lidMat} scale={r + 0.03} />}
        </group>
      ))}
    </group>
  );
}
