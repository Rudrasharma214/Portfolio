import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/context/MotionContext';
import { SNIPPET, TOTAL_CHARS, TYPE_MS, HOLD_MS, type Token } from './codeSnippet';

const TOKEN_CLASS: Record<NonNullable<Token['cls']>, string> = {
  kw: 'text-accent',
  str: 'text-accent-alt-soft',
  fn: 'text-accent-soft',
  comment: 'text-faint',
};

function clsFor(cls: Token['cls']) {
  return cls ? TOKEN_CLASS[cls] : 'text-ink/90';
}

function renderLines(revealed: number) {
  let left = revealed;
  return SNIPPET.map((line, li) => {
    const visible = left > 0 || li === 0;
    const nodes = line.map((tok, ti) => {
      const take = Math.max(0, Math.min(tok.text.length, left));
      left -= take;
      return (
        <span key={ti} className={clsFor(tok.cls)}>
          {tok.text.slice(0, take)}
        </span>
      );
    });
    left -= 1;
    if (!visible) return null;
    return (
      <div key={li} className="whitespace-pre">
        {line.length === 0 ? ' ' : nodes}
      </div>
    );
  });
}

/** An isometric-ish MacBook mockup whose screen types out a real backend snippet. */
export function CodeMacBook() {
  const { paused } = useMotion();
  const [revealed, setRevealed] = useState(paused ? TOTAL_CHARS : 0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const direction = useRef<'typing' | 'holding'>('typing');

  useEffect(() => {
    if (paused) {
      setRevealed(TOTAL_CHARS);
      return;
    }

    setRevealed(0);
    direction.current = 'typing';
    const id = setInterval(() => {
      setRevealed((n) => {
        if (direction.current === 'holding') return n;
        if (n >= TOTAL_CHARS) {
          direction.current = 'holding';
          setTimeout(() => {
            direction.current = 'typing';
            setRevealed(0);
          }, HOLD_MS);
          return n;
        }
        return n + 1;
      });
    }, TYPE_MS);

    return () => clearInterval(id);
  }, [paused]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (paused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -9, ry: px * 13 });
  }

  function handleLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px]">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[90px]"
      />

      <div className="hero-float flex h-full w-full items-center justify-center">
        <div
          className="flex h-full w-full items-center justify-center [perspective:1400px]"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <div
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
            className="w-[88%] transition-transform duration-300 ease-out [transform-style:preserve-3d]"
          >
            <div className="rounded-t-xl border border-line-strong bg-surface-2 p-3.5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.65)] sm:p-4">
              <div className="mb-2.5 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent-alt/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                <span className="micro ml-2 text-faint">aboutMe.ts</span>
              </div>
              <pre className="min-h-[200px] font-mono text-[10.5px] leading-[1.75] sm:text-[12.5px]">
                {renderLines(revealed)}
                {!paused ? <span className="cursor-blink text-accent">▍</span> : null}
              </pre>
            </div>

            <div className="h-[5px] bg-gradient-to-b from-line-strong to-line" />

            <div
              className="relative h-5 bg-gradient-to-b from-surface-2 to-surface sm:h-6"
              style={{ clipPath: 'polygon(4% 0, 96% 0, 100% 100%, 0% 100%)' }}
            >
              <div className="absolute top-1 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-line-strong/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
