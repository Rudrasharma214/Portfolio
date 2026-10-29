import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';

// The CV route pulls in nothing heavy, but splitting it keeps the home entry lean.
const CV = lazy(() => import('@/pages/CV'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function Deferred({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="bg-bg min-h-screen" />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  {
    path: '/cv',
    element: (
      <Deferred>
        <CV />
      </Deferred>
    ),
  },
  {
    path: '*',
    element: (
      <Deferred>
        <NotFound />
      </Deferred>
    ),
  },
]);
