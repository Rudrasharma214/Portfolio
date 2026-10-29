/**
 * Shown instead of the canvas when motion is off, WebGL is unavailable, or the
 * scene chunk is still loading. A static SVG of the same woven silhouette, so
 * the hero never collapses to empty space.
 */
export function SceneFallback({ label = 'Fig. 01 — System topology' }: { label?: string }) {
  return (
    <div className="border-line/60 relative mx-auto aspect-square w-[90%] max-w-[430px] self-center rounded-full border lg:max-h-[550px] lg:w-full lg:max-w-none">
      <span aria-hidden className="border-line/50 absolute inset-[11%] rounded-full border" />
      <span aria-hidden className="border-line/40 absolute inset-[28%] rounded-full border" />

      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label="Abstract diagram of a connected system"
        className="absolute inset-0 size-full"
      >
        <defs>
          <radialGradient id="scene-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb627" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffb627" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scene-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb627" />
            <stop offset="100%" stopColor="#ff6b1a" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="90" fill="url(#scene-glow)" />

        {Array.from({ length: 11 }, (_, i) => {
          const angle = (i / 11) * Math.PI * 2;
          const rx = 52 + 14 * Math.cos(3 * angle);
          return (
            <ellipse
              key={i}
              cx="100"
              cy="100"
              rx={rx}
              ry={rx * 0.42}
              fill="none"
              stroke="url(#scene-stroke)"
              strokeOpacity={0.2 + (i % 3) * 0.1}
              strokeWidth="0.5"
              transform={`rotate(${(i / 11) * 180} 100 100)`}
            />
          );
        })}

        {Array.from({ length: 22 }, (_, i) => {
          const angle = (i / 22) * Math.PI * 2;
          const r = 58 + 10 * Math.cos(3 * angle);
          return (
            <circle
              key={i}
              cx={100 + Math.cos(angle) * r}
              cy={100 + Math.sin(angle) * r * 0.46}
              r="1.1"
              fill="#ff6b1a"
              fillOpacity="0.7"
            />
          );
        })}
      </svg>

      <span className="micro bg-bg text-muted absolute top-[8%] left-[3%] p-1.5 text-[9px]">
        {label}
      </span>
    </div>
  );
}
