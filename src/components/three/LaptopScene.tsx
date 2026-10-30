import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { DoubleSide } from 'three';
import { Controls } from './Controls';
import { useCodeScreenTexture } from './useCodeScreenTexture';
import { useMotion } from '@/context/MotionContext';
import { useInViewport } from '@/hooks/useInViewport';
import { CodeMacBook } from '@/components/hero/CodeMacBook';

/** One-off probe: a WebGL context can be unavailable on old or locked-down devices. */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}

/**
 * Renders a single frame whenever the loop is parked, so a paused or
 * scrolled-away scene shows the laptop rather than an empty canvas.
 */
function StaticFrame({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) invalidate();
  }, [active, invalidate]);

  return null;
}

/**
 * The laptop body: a flat base and a lid hinged at its back edge, open to a
 * natural "sitting on a desk" angle. The screen is a canvas texture typing
 * out real code — see `useCodeScreenTexture`.
 */
function Laptop({ paused }: { paused: boolean }) {
  const texture = useCodeScreenTexture(paused);

  return (
    <group position={[0, 0.22, 0]} rotation={[0, Math.PI * 0.08, 0]}>
      {/* Base / keyboard deck. */}
      <mesh position={[0, -0.78, 0]}>
        <boxGeometry args={[2.6, 0.09, 1.7]} />
        <meshStandardMaterial color="#242019" roughness={0.45} metalness={0.3} />
      </mesh>

      {/* Trackpad. */}
      <mesh position={[0, -0.734, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.85, 0.55]} />
        <meshStandardMaterial color="#131110" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Lid, hinged at the base's back-top edge. */}
      <group position={[0, -0.735, -0.85]} rotation={[-1.74, 0, 0]}>
        <mesh position={[0, 0, 0.8]}>
          <boxGeometry args={[2.6, 0.07, 1.6]} />
          <meshStandardMaterial color="#242019" roughness={0.45} metalness={0.3} />
        </mesh>

        {/* Screen, inset on the lid's inner face with a visible bezel. */}
        <mesh position={[0, -0.039, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.18, 1.3]} />
          <meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export function LaptopScene() {
  const { paused } = useMotion();
  const { ref, inView } = useInViewport<HTMLDivElement>('150px');
  const [webgl] = useState(supportsWebGL);

  // Idle the render loop when the hero is off-screen or motion is off.
  const active = inView && !paused;

  if (!webgl) return <CodeMacBook />;

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-[92%] max-w-[480px] self-center lg:max-h-[560px] lg:w-full lg:max-w-none"
    >
      <div className="absolute inset-[-6%] z-[1] cursor-grab touch-pan-y active:cursor-grabbing">
        <Canvas
          frameloop={active ? 'always' : 'demand'}
          dpr={[1, 2]}
          camera={{ position: [1.5, 1.05, 4.0], fov: 36 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          // The scene is decorative; its meaning is carried by the labels below.
          aria-hidden
        >
          <StaticFrame active={active} />
          <ambientLight intensity={0.95} color="#554a3f" />
          <directionalLight position={[2.5, 4, 3]} intensity={2.1} color="#fff4e0" />
          <pointLight position={[-2.6, 1.6, -0.5]} intensity={1.1} color="#ff6b1a" />
          <pointLight position={[2.2, -0.8, 2.2]} intensity={0.7} color="#ffb627" />
          <pointLight position={[0, 1, -2.4]} intensity={0.6} color="#ff8c42" />
          <Laptop paused={paused} />
          <Controls autoRotate={active} />
        </Canvas>
      </div>

      <span className="micro bg-bg text-muted absolute top-[2%] left-[2%] z-[2] p-1.5 text-[9px]">
        Fig. 01 — Live
      </span>
      <span className="micro bg-bg text-muted absolute right-0 bottom-[2%] z-[2] p-1.5 text-right text-[9px]">
        Drag to rotate ↔
      </span>
    </div>
  );
}
