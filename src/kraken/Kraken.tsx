import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Arm } from './Arm';
import { Body } from './Body';
import { MOODS, blendMood, type Mood } from './moods';
import type { KrakenState } from './state';
import type { Quality } from './quality';
import { COLORS, toonMaterial } from './toon';

type Props = { state: KrakenState; quality: Quality; renderProp?: (index: number) => React.ReactNode };

/** The whole creature. Reads `state` every frame; never re-renders after mount. */
export function Kraken({ state, quality, renderProp }: Props) {
  const root = useRef<THREE.Group>(null);
  const arms = useRef<THREE.Group>(null);
  const mood = useRef<Mood>({ ...MOODS.neutral });
  const look = useRef<[number, number]>([0, 0]);
  const skirt = useMemo(() => toonMaterial(COLORS.coral), []);

  useFrame(({ clock }, dt) => {
    // A throttled or background tab delivers a frame a second: snap instead of easing slowly.
    const snap = !quality.loop || dt > 0.25;
    const k = snap ? 1 : 1 - Math.exp(-dt * 6);
    mood.current = blendMood(mood.current, MOODS[state.mood], k);
    look.current[0] += (state.look[0] - look.current[0]) * k;
    look.current[1] += (state.look[1] - look.current[1]) * k;
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
      <Body mood={mood} look={() => look.current} outline={quality.outline} animate={quality.loop} />
      <group ref={arms}>
        {/* a soft skirt under the head hides where the arms begin */}
        <mesh position={[0, -0.36, 0]} scale={[0.86, 0.3, 0.86]} material={skirt}>
          <sphereGeometry args={[1, 32, 16]} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <Arm key={i} index={i} state={state} quality={quality}>
            {renderProp?.(i)}
          </Arm>
        ))}
      </group>
    </group>
  );
}
