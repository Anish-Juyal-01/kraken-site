import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Arm } from './Arm';
import { Body } from './Body';
import { MOODS, blendMood, type Mood } from './moods';
import type { KrakenState } from './state';
import type { Quality } from './quality';
import type { Look } from './looks';
import { lookMaterial } from './toon';

type Props = { look: Look; state: KrakenState; quality: Quality; renderProp?: (index: number) => React.ReactNode };

/** The whole creature. Reads `state` every frame; never re-renders after mount. */
export function Kraken({ look, state, quality, renderProp }: Props) {
  const root = useRef<THREE.Group>(null);
  const arms = useRef<THREE.Group>(null);
  const mood = useRef<Mood>({ ...MOODS.neutral });
  const gaze = useRef<[number, number]>([0, 0]);
  const skirt = useMemo(() => lookMaterial(look, look.skin), [look]);
  const skirtOutline = useMemo(() => new THREE.MeshBasicMaterial({ color: look.outline ?? '#000000', side: THREE.BackSide }), [look]);
  const ow = look.outlineWidth * 1.4;

  useFrame(({ clock }, dt) => {
    // A throttled or background tab delivers a frame a second: snap instead of easing slowly.
    const snap = !quality.loop || dt > 0.25;
    const k = snap ? 1 : 1 - Math.exp(-dt * 6);
    mood.current = blendMood(mood.current, MOODS[state.mood], k);
    gaze.current[0] += (state.look[0] - gaze.current[0]) * k;
    gaze.current[1] += (state.look[1] - gaze.current[1]) * k;
    if (root.current) {
      // a slow bob, as if hanging in the water
      const bob = quality.loop ? Math.sin(clock.elapsedTime * 1.15) * 0.045 : 0;
      root.current.position.set(state.x, state.y + bob, state.z);
      root.current.scale.setScalar(state.scale);
      root.current.visible = state.scale > 0.01;
    }
    if (arms.current) {
      // shortest way round to the target angle
      let d = (state.ring - arms.current.rotation.y) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      arms.current.rotation.y += d * (snap ? 1 : 1 - Math.exp(-dt * 3.5));
    }
  });

  return (
    <group ref={root}>
      <Body look={look} mood={mood} gazeAt={() => gaze.current} outline={quality.outline} animate={quality.loop} />
      <group ref={arms}>
        {/* a soft skirt under the head hides where the arms begin */}
        <mesh position={[0, -0.36, 0]} scale={[0.86 * look.web, 0.3, 0.86 * look.web]} material={skirt}>
          <sphereGeometry args={[1, 32, 16]} />
        </mesh>
        {quality.outline && look.outline && look.outlineWidth > 0 && (
          <mesh position={[0, -0.36, 0]} scale={[0.86 * look.web + ow, 0.3 + ow, 0.86 * look.web + ow]} material={skirtOutline}>
            <sphereGeometry args={[1, 32, 16]} />
          </mesh>
        )}
        {Array.from({ length: 8 }, (_, i) => (
          <Arm key={i} index={i} look={look} state={state} quality={quality}>
            {renderProp?.(i)}
          </Arm>
        ))}
      </group>
    </group>
  );
}
