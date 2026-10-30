import { useEffect, useRef } from 'react';
import { useMotion } from '@/context/MotionContext';

/** Roughly 1 particle per this many square px of viewport, capped below. */
const DENSITY = 16000;
const MAX_PARTICLES = 70;
const MAX_DPR = 2;

const GOLD = [255, 182, 39] as const;
const ORANGE = [255, 107, 26] as const;

interface Particle {
  x: number;
  y: number;
  /** px/ms upward drift — these rise like embers rather than drift randomly. */
  vy: number;
  /** horizontal sway, applied as sin(time * swayFreq + swayPhase) * swaySpeed. */
  swayFreq: number;
  swayPhase: number;
  swayAmp: number;
  radius: number;
  alpha: number;
  color: readonly [number, number, number];
}

function makeParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vy: -(0.006 + Math.random() * 0.014),
    swayFreq: 0.0004 + Math.random() * 0.0006,
    swayPhase: Math.random() * Math.PI * 2,
    swayAmp: 8 + Math.random() * 18,
    radius: 0.7 + Math.random() * 1.6,
    alpha: 0.12 + Math.random() * 0.28,
    color: Math.random() < 0.72 ? GOLD : ORANGE,
  };
}

/**
 * A faint field of drifting embers behind the whole site, echoing the hero's
 * 3D point cloud so the motif carries past the first screen instead of
 * stopping dead at the fold.
 *
 * Deliberately plain Canvas2D, not WebGL — this runs on every route for the
 * life of the page, so it stays far outside the `three` bundle and costs
 * near-nothing next to the hero's real 3D scene. It paints above normal page
 * content (an un-z-indexed `position: fixed` layer stacks there) but below
 * every piece of interactive chrome, which all carry an explicit z-index.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const frame = useRef(0);
  const { paused } = useMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const seed = () => {
      const count = Math.min(MAX_PARTICLES, Math.round((width * height) / DENSITY));
      particles.current = Array.from({ length: count }, () => makeParticle(width, height));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();

    let lastTime = 0;

    const draw = (time: number) => {
      frame.current = requestAnimationFrame(draw);

      if (document.hidden) return;
      const dt = lastTime ? Math.min(time - lastTime, 50) : 0;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles.current) {
        p.y += p.vy * dt;
        // Rise off the top, re-enter from the bottom — keeps the field going
        // without ever reseeding mid-flight.
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        const x = p.x + Math.sin(time * p.swayFreq + p.swayPhase) * p.swayAmp;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`;
        ctx.arc(x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // A single static frame when motion is off, so the field is present —
    // just not moving — rather than blank.
    if (paused) {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles.current) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      frame.current = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', resize);
    };
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 select-none"
    />
  );
}
