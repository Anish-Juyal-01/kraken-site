import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PropKind } from '../content/content';
import type { KrakenState } from './state';
import { COLORS, toonMaterial } from './toon';

const BONE = '#ece7d9';
const WQ = new THREE.Quaternion();

function useMats() {
  return useMemo(
    () => ({
      bone: toonMaterial(BONE),
      ink: toonMaterial('#1d4a42'),
      coral: toonMaterial(COLORS.coralLight),
      dark: new THREE.MeshBasicMaterial({ color: COLORS.ink }),
    }),
    [],
  );
}

/** The little thing each arm holds. Built from boxes, cylinders and cones; +Y points along the arm. */
function Shape({ kind }: { kind: PropKind }) {
  const m = useMats();
  switch (kind) {
    case 'pencil':
      return (
        <group position={[0, 0.1, 0]} rotation={[0, 0, -0.35]}>
          <mesh material={m.bone} position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.44, 6]} />
          </mesh>
          <mesh material={m.coral} position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.062, 0.062, 0.08, 6]} />
          </mesh>
          <mesh material={m.ink} position={[0, 0.5, 0]}>
            <coneGeometry args={[0.06, 0.16, 6]} />
          </mesh>
        </group>
      );
    case 'trumpet':
      return (
        <group position={[0, 0.08, 0]} rotation={[0, 0, 0.5]}>
          <mesh material={m.bone} position={[0, 0.28, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.24, 0.42, 20, 1, true]} />
          </mesh>
          <mesh material={m.ink} position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.035, 0.045, 0.14, 10]} />
          </mesh>
        </group>
      );
    case 'flag':
      return (
        <group position={[0, 0.06, 0]}>
          <mesh material={m.ink} position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.66, 8]} />
          </mesh>
          <mesh material={m.bone} position={[0.17, 0.5, 0]}>
            <boxGeometry args={[0.32, 0.2, 0.03]} />
          </mesh>
          <mesh material={m.coral} position={[0.17, 0.5, 0.018]}>
            <boxGeometry args={[0.32, 0.055, 0.01]} />
          </mesh>
        </group>
      );
    case 'hammer':
      return (
        <group position={[0, 0.06, 0]} rotation={[0, 0, -0.3]}>
          <mesh material={m.ink} position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.03, 0.036, 0.54, 8]} />
          </mesh>
          <mesh material={m.bone} position={[0, 0.52, 0]}>
            <boxGeometry args={[0.34, 0.16, 0.16]} />
          </mesh>
        </group>
      );
    case 'umbrella':
      return (
        <group position={[0, 0.06, 0]}>
          <mesh material={m.ink} position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          </mesh>
          <mesh material={m.bone} position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.36, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
          </mesh>
          <mesh material={m.coral} position={[0, 0.87, 0]}>
            <sphereGeometry args={[0.035, 8, 6]} />
          </mesh>
        </group>
      );
    case 'letter':
      return (
        <group position={[0, 0.26, 0]} rotation={[0, 0, 0.2]}>
          <mesh material={m.bone}>
            <boxGeometry args={[0.46, 0.3, 0.03]} />
          </mesh>
          <mesh material={m.coral} position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          </mesh>
        </group>
      );
    case 'book':
      return (
        <group position={[0, 0.26, 0]} rotation={[0, 0, -0.18]}>
          <mesh material={m.ink}>
            <boxGeometry args={[0.36, 0.46, 0.1]} />
          </mesh>
          <mesh material={m.bone} position={[0.02, 0, 0]}>
            <boxGeometry args={[0.33, 0.41, 0.085]} />
          </mesh>
          <mesh material={m.ink} position={[0, 0, 0.051]}>
            <boxGeometry args={[0.36, 0.46, 0.008]} />
          </mesh>
          <mesh material={m.coral} position={[0, 0.08, 0.057]}>
            <boxGeometry args={[0.2, 0.05, 0.006]} />
          </mesh>
        </group>
      );
  }
}

/** A prop at the tip of arm `index`. It appears when that arm is the one in front. */
export function Prop({ kind, index, state }: { kind: PropKind; index: number; state: KrakenState }) {
  const g = useRef<THREE.Group>(null);
  const size = useRef(0);
  useFrame((_, dt) => {
    // Only the arm in front shows its prop: eight at once read as clutter.
    const target = state.activeArm === index ? 1.15 : 0;
    size.current += (target - size.current) * (dt > 0.25 ? 1 : 1 - Math.exp(-dt * 6));
    if (g.current) {
      // Keep the prop upright and facing the visitor whatever way the arm bends: a letter seen
      // edge-on is just a line.
      g.current.parent?.getWorldQuaternion(WQ);
      g.current.quaternion.copy(WQ.invert());
      g.current.visible = size.current > 0.02;
      g.current.scale.setScalar(size.current);
    }
  });
  return (
    <group ref={g}>
      <Shape kind={kind} />
    </group>
  );
}
