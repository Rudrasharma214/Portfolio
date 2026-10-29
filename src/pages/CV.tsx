import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CV_FILENAME, CV_PATH, profile, seo } from '@/content';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

// pdfjs is only needed on this route; keep it out of the shared chunks.
const PdfViewer = lazy(() =>
  import('@/components/cv/PdfViewer').then((m) => ({ default: m.PdfViewer })),
);

const FILENAME = CV_PATH.replace(/^\//, '');

export default function CV() {
  const frame = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useDocumentMeta(seo.cvTitle, seo.cvDescription);

  useEffect(() => {
    const onChange = () => setExpanded(document.fullscreenElement === frame.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleExpand = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      // Safari can reject this; falling back to the inline view is fine.
      void frame.current?.requestFullscreen?.().catch(() => undefined);
    }
  }, []);

  return (
    <PageShell>
      <section className="py-10 lg:py-14">
        <Container>
          <Reveal variant="up">
            <div className="mb-9 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                {/* <Eyebrow>Curriculum vitae</Eyebrow> */}
                <h1 className="mt-5 mb-3 text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-medium tracking-[-0.05em]">
                  {profile.name}
                </h1>
                <p className="m-0 text-sm text-muted">
                  {profile.role} · {profile.location}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <ButtonLink href={CV_PATH} download={CV_FILENAME}>
                  Download PDF <span aria-hidden>↓</span>
                </ButtonLink>
                <ButtonLink
                  variant="quiet"
                  href={CV_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab <span aria-hidden>↗</span>
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          <Reveal variant="scale" duration={900}>
            <div
              ref={frame}
              className="mx-auto max-w-[920px] overflow-hidden rounded-xl border border-line bg-surface fullscreen:flex fullscreen:max-w-none fullscreen:flex-col fullscreen:rounded-none"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
                <span className="micro text-[11px] text-muted">{FILENAME}</span>
                <button
                  type="button"
                  onClick={toggleExpand}
                  aria-pressed={expanded}
                  aria-label={expanded ? 'Exit full screen' : 'View full screen'}
                  className="grid size-8 place-items-center rounded border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden
                    className="size-3.5 fill-none stroke-current stroke-[1.4]"
                  >
                    {expanded ? (
                      <path d="M6 1.5V6H1.5M10 14.5V10h4.5" strokeLinecap="round" />
                    ) : (
                      <path d="M1.5 6V1.5H6M10 14.5h4.5V10" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
              </div>

              {/* The viewer rasterises to the container's exact width, so the
                  page fills the frame edge to edge at any size. */}
              <div className="fullscreen:flex-1 fullscreen:overflow-auto">
                <Suspense
                  fallback={
                    <div className="grid aspect-[210/297] w-full place-items-center">
                      <span className="micro text-[10px] text-faint">Loading viewer...</span>
                    </div>
                  }
                >
                  <PdfViewer src={CV_PATH} className="w-full" />
                </Suspense>
              </div>
            </div>
          </Reveal>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-accent"
          >
            <span aria-hidden>←</span> Back to portfolio
          </Link>
        </Container>
      </section>
    </PageShell>
  );
}
