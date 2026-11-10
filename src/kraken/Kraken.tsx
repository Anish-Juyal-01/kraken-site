import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Arm } from './Arm';
import { Body } from './Body';
import { MOODS, blendMood, type Mood } from './moods';
import type { KrakenState } from './state';
import type { Quality } from './quality';

type Props = { state: KrakenState; quality: Quality; renderProp?: (index: number) => React.ReactNode };

/** The whole creature. Reads `state` every frame; never re-renders after mount. */
export function Kraken({ state, quality, renderProp }: Props) {
  const root = useRef<THREE.Group>(null);
  const arms = useRef<THREE.Group>(null);
  const mood = useRef<Mood>({ ...MOODS.neutral });
  const look = useRef<[number, number]>([0, 0]);

  useFrame((_, dt) => {
    const k = quality.loop ? 1 - Math.exp(-Math.min(dt, 0.1) * 6) : 1;
    mood.current = blendMood(mood.current, MOODS[state.mood], k);
    look.current[0] += (state.look[0] - look.current[0]) * k;
    look.current[1] += (state.look[1] - look.current[1]) * k;
    if (root.current) {
      root.current.position.y = state.y;
      root.current.scale.setScalar(state.scale);
      root.current.visible = state.scale > 0.01;
    }
    if (arms.current) {
      // shortest way round to the target angle
      let d = (state.ring - arms.current.rotation.y) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      arms.current.rotation.y += d * (quality.loop ? 1 - Math.exp(-Math.min(dt, 0.1) * 3.5) : 1);
    }
  });

  return (
    <group ref={root}>
      <Body mood={mood} look={() => look.current} outline={quality.outline} animate={quality.loop} />
      <group ref={arms}>
        {Array.from({ length: 8 }, (_, i) => (
          <Arm key={i} index={i} state={state} quality={quality}>
            {renderProp?.(i)}
          </Arm>
        ))}
      </group>
    </group>
  );
}
