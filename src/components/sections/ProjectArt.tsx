import type { ProjectArt as Variant } from '@/types/content';

/**
 * CSS-only thumbnails standing in for product screenshots, in the spirit of the
 * prototype's decorative art. Each variant encodes what the service actually does.
 */
export function ProjectArt({ variant }: { variant: Variant }) {
  return (
    <div className="from-surface-2 to-surface relative h-[235px] overflow-hidden bg-gradient-to-br">
      {variant === 'ai' ? <AiArt /> : null}
      {variant === 'realtime' ? <RealtimeArt /> : null}
      {variant === 'services' ? <ServicesArt /> : null}
    </div>
  );
}

/** Stacked documents feeding a pipeline — the doc Q&A flow. */
function AiArt() {
  return (
    <div
      aria-hidden
      className="absolute top-1/2 left-1/2 size-[135px] -translate-x-1/2 -translate-y-1/2 [perspective:500px]"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="border-gold/30 absolute inset-0 animate-[drift_7s_ease-in-out_infinite] rounded-lg border shadow-[0_15px_28px_rgba(0,0,0,0.45)]"
          style={{
            transform: `translate(${(1 - i) * 14}px, ${(i - 1) * 14}px) rotateY(-20deg) rotateX(17deg)`,
            background:
              i === 0
                ? 'linear-gradient(135deg,#6b4a22,#2a1e10)'
                : i === 1
                  ? 'linear-gradient(135deg,#4a3418,#1d150b)'
                  : 'linear-gradient(135deg,#332410,#15100a)',
            animationDelay: `${-i * 2}s`,
          }}
        >
          <span className="bg-gold/25 absolute top-7 right-6 left-6 h-1 shadow-[0_17px_rgba(255,182,39,0.18),0_34px_rgba(255,182,39,0.14),0_51px_rgba(255,182,39,0.1)]" />
        </span>
      ))}
    </div>
  );
}

/** Three nodes on a shared bus — sockets fanning out through Redis. */
function RealtimeArt() {
  return (
    <div
      aria-hidden
      className="absolute top-1/2 left-1/2 h-[130px] w-[170px] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] skew-x-[10deg]"
    >
      <span className="bg-orange/35 absolute top-[65px] left-3 h-px w-[83px] -rotate-[53deg]" />
      <span className="bg-orange/35 absolute top-[65px] left-[79px] h-px w-[83px] rotate-[53deg]" />
      {[
        { top: 0, left: 60 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ].map((pos, i) => (
        <span
          key={i}
          style={{ ...pos, animationDelay: `${-i * 2}s` }}
          className="border-orange-soft absolute size-[50px] animate-[drift_6s_ease-in-out_infinite] rounded-xl border bg-gradient-to-br from-[#b75c25] to-[#4a2a12] shadow-[0_8px_0_#2d1a0e,0_15px_25px_rgba(0,0,0,0.35)]"
        >
          <span className="border-gold/60 absolute inset-[15px] rounded-[5px] border" />
        </span>
      ))}
    </div>
  );
}

/** A hexagonal shield — the credential and auth services. */
function ServicesArt() {
  return (
    <div
      aria-hidden
      className="absolute top-1/2 left-1/2 h-[138px] w-[116px] -translate-x-1/2 -translate-y-1/2 animate-[drift_7s_ease-in-out_infinite] bg-gradient-to-br from-[#8a6a3a] via-[#2a2118] to-[#6e5228] drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] [clip-path:polygon(50%_0,96%_18%,89%_65%,73%_84%,50%_100%,27%_84%,11%_65%,4%_18%)]"
    >
      <span className="absolute inset-[5px] bg-gradient-to-br from-[#3a2d1a] to-[#171208] [clip-path:inherit]" />
      <span className="text-gold/80 absolute inset-0 grid place-items-center text-[55px]">✳</span>
    </div>
  );
}
