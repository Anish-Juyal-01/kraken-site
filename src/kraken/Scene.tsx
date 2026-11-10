import { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Kraken } from './Kraken';
import { FULL, type Quality } from './quality';
import { initialState } from './state';

type Props = { quality?: Quality };

/** The fixed 3D layer behind the page. */
export default function Scene({ quality = FULL }: Props) {
  const state = useMemo(() => initialState(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      state.look = [(e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)];
      state.lean = state.look;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [state]);

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: 'none' }}
      dpr={[1, quality.mode === 'full' ? 2 : 1.5]}
      camera={{ fov: 32, position: [0, 0.5, 8.5], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true }}
      frameloop={quality.loop ? 'always' : 'demand'}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[-3, 5, 6]} intensity={2.2} />
      <Kraken state={state} quality={quality} />
    </Canvas>
  );
}
