import { useCallback, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MotionProvider, useMotion } from '@/context/MotionContext';
import { Loader } from '@/components/ui/Loader';
import { ParticleField } from '@/components/ui/ParticleField';
import { router } from '@/router';

/** Sits inside the provider so the splash can read the motion preference. */
function Shell() {
  const { paused } = useMotion();
  const [booted, setBooted] = useState(false);
  const handleDone = useCallback(() => setBooted(true), []);

  return (
    <>
      {!booted ? <Loader onDone={handleDone} skip={paused} /> : null}
      {/* One global layer, outside any route's tree, so it persists across
          navigation instead of remounting on every page. */}
      <ParticleField />
      <RouterProvider router={router} />
    </>
  );
}

export function App() {
  return (
    <MotionProvider>
      <Shell />
    </MotionProvider>
  );
}
