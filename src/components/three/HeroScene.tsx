import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Controls } from './Controls';
import { useMotion } from '@/context/MotionContext';
import { useInViewport } from '@/hooks/useInViewport';
import { MorphField } from './MorphField';
import { Satellites } from './Satellites';
import { SceneControls } from './SceneControls';
import { SceneFallback } from './SceneFallback';
import { SHAPE_LABELS, type ShapeId } from './shapes';

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
 * scrolled-away scene shows the shape rather than an empty canvas.
 */
function StaticFrame({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) invalidate();
  }, [active, invalidate]);

  return null;
}

export function HeroScene() {
  const { paused } = useMotion();
  const { ref, inView } = useInViewport<HTMLDivElement>('150px');
  const [mode, setMode] = useState<ShapeId>('mesh');
  const [webgl] = useState(supportsWebGL);

  // Idle the render loop when the hero is off-screen or motion is off.
  const active = inView && !paused;

  if (!webgl) return <SceneFallback />;

  return (
    <div
      ref={ref}
      className="border-line/60 relative mx-auto aspect-square w-[90%] max-w-[430px] self-center rounded-full border bg-[radial-gradient(ellipse_at_center,rgba(255,107,26,0.05),transparent_65%)] lg:max-h-[550px] lg:w-full lg:max-w-none"
    >
      <span aria-hidden className="border-line/50 absolute inset-[11%] rounded-full border" />
      <span aria-hidden className="border-line/40 absolute inset-[28%] rounded-full border" />

      <div className="absolute inset-[-8%] z-[1] cursor-grab touch-pan-y active:cursor-grabbing">
        <Canvas
          frameloop={active ? 'always' : 'demand'}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4.8], fov: 44 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          // The scene is decorative; its meaning is carried by the labels below.
          aria-hidden
        >
          <StaticFrame active={active} />
          <MorphField mode={mode} paused={paused} />
          <Satellites paused={paused} />
          <Controls autoRotate={active} />
        </Canvas>
      </div>

      <span className="micro bg-bg text-muted absolute top-[8%] left-[3%] z-[2] p-1.5 text-[9px]">
        Fig. 01 — Service topology
      </span>
      <span className="micro bg-bg text-muted absolute right-0 bottom-[17%] z-[2] p-1.5 text-right text-[9px]">
        Drag to rotate ↔
      </span>
      <span className="micro text-muted pointer-events-none absolute bottom-[8%] left-[10%] z-[2] text-[9px]">
        {SHAPE_LABELS[mode].caption}
      </span>

      <SceneControls mode={mode} onChange={setMode} />
    </div>
  );
}
