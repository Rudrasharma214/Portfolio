import { useCallback, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MotionProvider, useMotion } from '@/context/MotionContext';
import { Loader } from '@/components/ui/Loader';
import { router } from '@/router';

/** Sits inside the provider so the splash can read the motion preference. */
function Shell() {
  const { paused } = useMotion();
  const [booted, setBooted] = useState(false);
  const handleDone = useCallback(() => setBooted(true), []);

  return (
    <>
      {!booted ? <Loader onDone={handleDone} skip={paused} /> : null}
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
