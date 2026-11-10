import { useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ARMS } from '../content/content';
import { scrollStore } from '../scroll/store';
import { Bubbles } from './Bubbles';
import { cameraAt, krakenPlacement } from './camera';
import { depthColor } from './depth';
import { Kraken } from './Kraken';
import { Prop } from './props';
import { FULL, type Quality } from './quality';
import { initialState, type KrakenState } from './state';

type Props = { quality?: Quality; direct?: (state: KrakenState, p: number, now: number) => void };

const fogColor = new THREE.Color();

/** Applies scroll progress to the camera, the fog and the kraken once per frame. */
function Director({ state, direct }: { state: KrakenState; direct?: Props['direct'] }) {
  const { camera, scene, size } = useThree();
  useFrame(({ clock }) => {
    const p = scrollStore.get();
    const cam = cameraAt(p);
    camera.position.set(...cam.pos);
    camera.lookAt(...cam.look);
    const place = krakenPlacement(p, size.width / size.height);
    state.x = place.x;
    state.y = place.y;
    state.z = place.z;
    state.scale = place.scale;
    fogColor.set(depthColor(p));
    (scene.fog as THREE.Fog).color.copy(fogColor);
    direct?.(state, p, clock.elapsedTime);
  });
  return null;
}

/** The fixed 3D layer behind the page. */
export default function Scene({ quality = FULL, direct }: Props) {
  const state = useMemo(() => initialState(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      state.look = [(e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)];
      state.lean = state.look;
      state.lastMove = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [state]);

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: 'none', zIndex: 0 }}
      dpr={[1, quality.mode === 'full' ? 2 : 1.5]}
      camera={{ fov: 32, position: [0, 0.5, 8.5], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true }}
      frameloop={quality.loop ? 'always' : 'demand'}
    >
      <fog attach="fog" args={['#ece7d9', 9, 19]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[-3, 5, 6]} intensity={2.2} />
      <Director state={state} direct={direct} />
      <Kraken
        state={state}
        quality={quality}
        renderProp={(i) => {
          const kind = ARMS[i].prop;
          return kind ? <Prop kind={kind} index={i} state={state} /> : null;
        }}
      />
      {quality.bubbles > 0 && <Bubbles count={quality.bubbles} />}
    </Canvas>
  );
}
