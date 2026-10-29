import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Drag-to-rotate, built straight on three's own OrbitControls rather than a
 * wrapper library — it is the only control we need and keeps `three-stdlib`
 * out of the bundle.
 */
export function Controls({ autoRotate }: { autoRotate: boolean }) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const instance = new OrbitControls(camera, gl.domElement);
    instance.enableZoom = false;
    instance.enablePan = false;
    instance.enableDamping = true;
    instance.dampingFactor = 0.08;
    instance.rotateSpeed = 0.45;
    instance.autoRotateSpeed = 0.5;

    // OrbitControls sets `touch-action: none`, which would swallow vertical
    // swipes and trap the page scroll on phones. Allow pan-y back, as the
    // prototype did: drag sideways to rotate, swipe up to keep reading.
    gl.domElement.style.touchAction = 'pan-y';

    controls.current = instance;
    return () => {
      instance.dispose();
      controls.current = null;
    };
  }, [camera, gl]);

  useEffect(() => {
    if (controls.current) controls.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useFrame(() => controls.current?.update());

  return null;
}
