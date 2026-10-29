import { useState } from 'react';
import type { PhotoAsset } from '@/types/content';
import { cn } from './cn';

type Variant = 'portrait' | 'round';

const frames: Record<Variant, string> = {
  portrait: 'aspect-[4/5] rounded-lg',
  round: 'aspect-square rounded-full',
};

/**
 * A personal photo, shown as-is: no duotone, grayscale, blend mode or filter.
 *
 * The wrapper locks the aspect ratio so an off-ratio file crops rather than
 * distorts, and width/height come from JSON so nothing shifts while loading.
 * If the file is missing the broken-image icon is swapped for a neutral panel —
 * the layout stays intact until the real photo is dropped into `public/photos/`.
 */
export function Photo({
  asset,
  variant = 'portrait',
  className,
  priority = false,
}: {
  asset: PhotoAsset;
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn('border-line bg-surface overflow-hidden border', frames[variant], className)}
    >
      {failed ? (
        <div
          role="img"
          aria-label={`${asset.alt} — photo not available`}
          className="grid size-full place-items-center bg-[repeating-linear-gradient(135deg,transparent,transparent_9px,rgba(255,182,39,0.05)_9px,rgba(255,182,39,0.05)_18px)]"
        >
          <span className="micro text-faint px-3 text-center text-[9px]">Photo</span>
        </div>
      ) : (
        <img
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          style={{ objectPosition: asset.position ?? 'center' }}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}
