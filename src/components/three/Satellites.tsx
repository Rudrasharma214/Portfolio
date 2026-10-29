import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

const COUNT = 8;
const RADIUS = 2.45;

/**
 * Small specks orbiting the cloud, straight from the prototype — they give the
 * scene a sense of scale and make the rotation legible. Eight tiny meshes in a
 * group that spins; cheaper to reason about than instancing at this count.
 */
export function Satellites({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);

  const specks = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * Math.PI * 2;
        const r = RADIUS + 0.12 * Math.sin(i);
        return {
          key: i,
          position: [Math.cos(angle) * r, Math.sin(angle) * r * 0.58, 0] as const,
          // Every third speck picks up the accent accent.
          color: i % 3 === 0 ? '#ffb627' : '#7d756d',
        };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (paused || !group.current) return;
    group.current.rotation.z += Math.min(delta, 0.05) * 0.12;
  });

  return (
    <group ref={group}>
      {specks.map((speck) => (
        <mesh key={speck.key} position={[...speck.position]}>
          <planeGeometry args={[0.04, 0.04]} />
          <meshBasicMaterial color={speck.color} transparent opacity={0.45} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
