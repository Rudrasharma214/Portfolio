import { Link } from 'react-router-dom';
import { profile } from '@/content';

/** The RS monogram — the same mark the splash screen opens on. */
export function Brand({ to = '/' }: { to?: string }) {
  return (
    <Link
      to={to}
      aria-label={`${profile.name} — home`}
      className="group inline-flex items-center"
    >
      <span className="grid size-10 place-items-center rounded-sm border border-line-strong/70 text-[15px] font-bold tracking-[-0.03em] text-ink transition-colors duration-200 group-hover:border-orange group-hover:text-orange">
        {profile.monogram}
      </span>
    </Link>
  );
}
