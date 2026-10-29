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
      <span className="grid size-11 place-items-center rounded-md border border-line-strong/70 text-[18px] font-bold tracking-[-0.03em] text-ink transition-colors duration-200 group-hover:border-accent group-hover:text-accent lg:size-[52px] lg:text-[22px]">
        {profile.monogram}
      </span>
    </Link>
  );
}
