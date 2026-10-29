import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Sphere, Vector3 } from 'three';
import type { Group } from 'three';
import { POINT_COUNT, buildLineIndices, buildSeeds, buildShape, type ShapeId } from './shapes';
import { lineFragmentShader, morphVertexShader, pointFragmentShader } from './shaders';

/** Morph duration in seconds. */
const MORPH_SECONDS = 1.1;

const NEAR_COLOR = new Color('#ffb627');
const FAR_COLOR = new Color('#ff6b1a');

function easeInOut(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * The hero cloud: one set of points plus a wireframe of the same vertices,
 * morphing between the three shapes in `shapes.ts`.
 */
export function MorphField({ mode, paused }: { mode: ShapeId; paused: boolean }) {
  const group = useRef<Group>(null);
  const progress = useRef(1);

  // Built once. The three shape buffers are static; `from` and `to` are the
  // live attributes the shaders read.
  const { geometry, lineGeometry, shapes, from, to, uniforms } = useMemo(() => {
    const shapes: Record<ShapeId, Float32Array> = {
      mesh: buildShape('mesh'),
      cluster: buildShape('cluster'),
      stream: buildShape('stream'),
    };

    const from = new BufferAttribute(Float32Array.from(shapes.mesh), 3);
    const to = new BufferAttribute(Float32Array.from(shapes.mesh), 3);
    const seeds = new BufferAttribute(buildSeeds(), 1);

    // Both geometries share the same attribute instances, so a buffer update
    // reaches the points and the wireframe at once.
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', from);
    geometry.setAttribute('aTarget', to);
    geometry.setAttribute('aSeed', seeds);
    geometry.boundingSphere = new Sphere(new Vector3(), 2.4);

    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute('position', from);
    lineGeometry.setAttribute('aTarget', to);
    lineGeometry.setAttribute('aSeed', seeds);
    lineGeometry.setIndex(new BufferAttribute(buildLineIndices(), 1));
    lineGeometry.boundingSphere = new Sphere(new Vector3(), 2.4);

    const uniforms = {
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uSize: { value: 0.028 },
      uBreathe: { value: 1 },
      uNear: { value: NEAR_COLOR },
      uFar: { value: FAR_COLOR },
    };

    return { geometry, lineGeometry, shapes, from, to, uniforms };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      lineGeometry.dispose();
    },
    [geometry, lineGeometry],
  );

  // On a mode change, bake the current in-between positions into `from` and
  // point `to` at the new shape. One CPU pass per click, not per frame.
  useEffect(() => {
    const eased = easeInOut(Math.min(1, progress.current));
    const fromArr = from.array as Float32Array;
    const toArr = to.array as Float32Array;
    const next = shapes[mode];

    for (let i = 0; i < POINT_COUNT * 3; i++) {
      fromArr[i] = fromArr[i] + (toArr[i] - fromArr[i]) * eased;
      toArr[i] = next[i];
    }

    from.needsUpdate = true;
    to.needsUpdate = true;
    progress.current = 0;
    uniforms.uProgress.value = 0;
  }, [mode, from, to, shapes, uniforms]);

  useEffect(() => {
    uniforms.uBreathe.value = paused ? 0 : 1;
  }, [paused, uniforms]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + dt / MORPH_SECONDS);
      uniforms.uProgress.value = progress.current;
    }

    if (!paused) {
      uniforms.uTime.value += dt;
      if (group.current) group.current.rotation.z += dt * 0.06;
    }
  });

  return (
    <group ref={group} rotation={[0.45, 0, 0]}>
      <lineSegments geometry={lineGeometry} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={morphVertexShader}
          fragmentShader={lineFragmentShader}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>

      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={morphVertexShader}
          fragmentShader={pointFragmentShader}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}
