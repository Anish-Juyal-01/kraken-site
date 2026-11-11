import { useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ARMS } from '../content/content';
import { scrollStore } from '../scroll/store';
import { Bubbles } from './Bubbles';
import { cameraAt, krakenPlacement } from './camera';
import { depthColor } from './depth';
import { Kraken } from './Kraken';
import { lookById, type Look } from './looks';
import { Prop } from './props';
import { FULL, type Quality } from './quality';
import { initialState, type KrakenState } from './state';

type Props = { quality?: Quality; look?: Look; direct?: (state: KrakenState, p: number, now: number) => void; onLost?: () => void };

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
    // Where is the cursor, in the kraken's own plane? Eyes and arms aim from the head, not from
    // the middle of the screen.
    const lens = camera as THREE.PerspectiveCamera;
    const dist = Math.max(0.1, lens.position.z - state.z);
    const halfH = Math.tan((lens.fov * Math.PI) / 360) * dist;
    const cx = lens.position.x + state.cursor[0] * halfH * (size.width / size.height);
    const cy = lens.position.y + state.cursor[1] * halfH;
    const dx = cx - state.x;
    const dy = cy - (state.y + 0.6 * state.scale);
    const cl = (n: number) => Math.max(-1, Math.min(1, n));
    state.look = [cl(dx / 2.2), cl(dy / 1.8)];
    state.lean = [cl(dx / (1.9 * state.scale)), cl((dy + 0.9 * state.scale) / (1.9 * state.scale))];
  });
  return null;
}

/** The fixed 3D layer behind the page. */
export default function Scene({ quality = FULL, look = lookById(null), direct, onLost }: Props) {
  const state = useMemo(() => initialState(), []);
  if (import.meta.env.DEV) (window as unknown as { __k: KrakenState }).__k = state;

  useEffect(() => {
    if (!quality.loop) return; // a still scene does not follow the cursor
    const onMove = (e: PointerEvent) => {
      state.cursor = [(e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)];
      state.lastMove = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [state, quality.loop]);

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: 'none', zIndex: 0 }}
      dpr={[1, quality.mode === 'full' ? 2 : 1.5]}
      camera={{ fov: 32, position: [0, 0.5, 8.5], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true }}
      // measure at once and ignore page scroll: the canvas is fixed to the screen
      resize={{ debounce: 0, scroll: false }}
      onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', () => onLost?.(), { once: true })}
    >
      <fog attach="fog" args={['#ece7d9', 9, 19]} />
      {/* warm light from above, a cool green bounce from the water below */}
      <hemisphereLight args={['#fff1e0', '#2f7a6c', 1.5]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[-3.5, 5, 6]} intensity={2.0} />
      <Director state={state} direct={direct} />
      <Kraken
        look={look}
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
