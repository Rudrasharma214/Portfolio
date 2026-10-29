import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigation, profile } from '@/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { Container } from '@/components/ui/Container';
import { cn } from '@/components/ui/cn';
import { Brand } from './Brand';
import { MobileNav } from './MobileNav';

const SECTION_IDS = navigation.map((item) => item.id);

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useActiveSection(onHome ? SECTION_IDS : []);

  return (
    <header className="border-line bg-bg/92 sticky top-0 z-40 border-b backdrop-blur-xl">
      <Container>
        <div className="flex h-[73px] items-center justify-between gap-6 lg:h-[88px]">
          <Brand />

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={onHome ? item.href : `/${item.href}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={cn(
                  'text-[13px] transition-colors',
                  active === item.id ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/cv"
              className={cn(
                'rounded-full border px-5 py-3 text-xs transition-colors',
                pathname === '/cv'
                  ? 'border-accent text-accent'
                  : 'border-line text-ink hover:border-accent',
              )}
            >
              CV
            </Link>
            {/* <a
              href={`mailto:${profile.email}`}
              className="border-line text-ink hover:border-accent rounded-full border px-5 py-3 text-xs transition-colors"
            >
              Let's connect
              <b className="text-accent-alt ml-3.5 font-normal">↗</b>
            </a> */}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="border-line rounded border px-3 py-2 text-[13px] md:hidden"
          >
            Menu +
          </button>
        </div>
      </Container>

      <MobileNav open={open} onClose={() => setOpen(false)} onHome={onHome} />
    </header>
  );
}
