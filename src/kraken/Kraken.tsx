import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Arm } from './Arm';
import { Body } from './Body';
import { MOODS, blendMood, type Mood, type MoodId } from './moods';
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
  // the last mood, and when it changed: each change plays a short reaction
  const react = useRef<{ mood: MoodId; at: number }>({ mood: state.mood, at: -10 });
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
    const now = clock.elapsedTime;
    if (state.mood !== react.current.mood) react.current = { mood: state.mood, at: now };
    const since = quality.loop ? now - react.current.at : 10;
    const fade = (rate: number) => Math.exp(-since * rate);
    let hop = 0;
    let tilt = 0;
    state.flinch = 0;
    state.cheer = 0;
    switch (react.current.mood) {
      case 'startled': // jump, shiver, pull the arms in
        hop = 0.3 * Math.sin(Math.min(1, since * 4) * Math.PI) * fade(0.6);
        tilt = Math.sin(since * 38) * 0.06 * fade(3);
        state.flinch = fade(1.1);
        break;
      case 'relieved': // sink with a long sigh, then settle
        hop = -0.16 * Math.sin(Math.min(1, since / 1.4) * Math.PI);
        break;
      case 'proud': // two happy hops, arms up
        hop = 0.22 * Math.abs(Math.sin(since * 6.5)) * fade(1.3);
        state.cheer = fade(0.7);
        break;
      case 'curious': // a little bounce and a head tilt
        hop = 0.09 * Math.abs(Math.sin(since * 6)) * fade(2.4);
        tilt = 0.08 * fade(1.5);
        break;
    }
    if (root.current) {
      // a slow bob, as if hanging in the water
      const bob = quality.loop ? Math.sin(now * 1.15) * 0.045 : 0;
      root.current.position.set(state.x, state.y + (bob + hop) * state.scale, state.z);
      root.current.rotation.z = tilt;
      root.current.scale.setScalar(state.scale);
      root.current.visible = state.scale > 0.01;
    }
    if (arms.current) {
      // shortest way round to the target angle
      let d = (state.ring - arms.current.rotation.y) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      arms.current.rotation.y += d * (snap ? 1 : 1 - Math.exp(-dt * 3.5));
      state.ringNow = arms.current.rotation.y;
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
