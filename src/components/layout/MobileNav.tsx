import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navigation, profile, socials } from '@/content';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/components/ui/cn';

/** Full-height drawer for phones. Closes on Esc, on backdrop tap and on navigation. */
export function MobileNav({
  open,
  onClose,
  onHome,
}: {
  open: boolean;
  onClose: () => void;
  onHome: boolean;
}) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <div
        id="mobile-nav"
        hidden={!open}
        className={cn(
          'border-line bg-bg fixed inset-x-0 top-0 z-50 border-b px-5 pt-6 pb-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="micro text-muted">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="border-line rounded border px-3 py-2 text-[13px]"
          >
            Close ×
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={onHome ? item.href : `/${item.href}`}
              onClick={onClose}
              className="border-line border-b py-4 text-2xl font-normal tracking-[-0.03em]"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/cv"
            onClick={onClose}
            className="border-line text-accent-alt border-b py-4 text-2xl font-normal tracking-[-0.03em]"
          >
            CV ↗
          </Link>
        </nav>

        <a
          href={`mailto:${profile.email}`}
          onClick={onClose}
          className="text-muted mt-8 block text-sm"
        >
          {profile.email}
        </a>
        <div className="mt-5 flex gap-5">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="micro text-muted text-[10px]"
            >
              {social.label} ↗
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
