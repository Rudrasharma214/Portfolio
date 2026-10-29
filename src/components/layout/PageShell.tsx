import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

/** Route-level chrome: sticky header, main landmark, footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="focus:bg-orange focus:text-bg sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <span id="top" />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
