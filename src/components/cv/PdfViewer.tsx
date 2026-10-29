import { useCallback, useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Pinned to the 4.x line deliberately: 5.x/6.x call several very recent
// JS engine features (Uint8Array.prototype.toHex, Map.prototype.
// getOrInsertComputed) that most browsers don't support yet, which throws
// on render. 4.x is the version actually deployed broadly today.
//
// Vite rewrites this to the hashed worker asset at build time.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/** Cap the backing store so a 3x DPR phone doesn't allocate an enormous canvas. */
const MAX_DPR = 2;

type Status = 'loading' | 'ready' | 'error';

/**
 * Renders the CV to canvases at exactly the container's width.
 *
 * The browser's own PDF plugin ignores `view=FitH` and `zoom=page-width` once
 * the toolbar is hidden, so an <iframe> leaves the page floating at an
 * arbitrary scale inside the frame. Rendering it ourselves fits every time,
 * works on phones -- where inline PDFs don't render at all -- and lets the
 * surrounding chrome match the rest of the site.
 */
export function PdfViewer({ src, className }: { src: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const doc = useRef<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [pages, setPages] = useState(0);

  const render = useCallback(async () => {
    const container = host.current;
    const pdf = doc.current;
    if (!container || !pdf) return;

    const width = container.clientWidth;
    if (width === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    container.replaceChildren();

    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const base = page.getViewport({ scale: 1 });

      // Rasterise at device resolution, then let CSS scale it back down to the
      // container width, so the text stays sharp on a retina screen.
      const viewport = page.getViewport({ scale: (width / base.width) * dpr });

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.display = 'block';
      container.append(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      await page.render({ canvasContext: ctx, viewport }).promise;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const task = pdfjs.getDocument({ url: src });

    task.promise
      .then(async (pdf) => {
        if (cancelled) return;
        doc.current = pdf;
        setPages(pdf.numPages);
        await render();
        if (!cancelled) setStatus('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('CV render failed', error);
        setStatus('error');
      });

    return () => {
      cancelled = true;
      void task.destroy();
      doc.current = null;
    };
  }, [src, render]);

  // Re-rasterise on resize so the page stays crisp rather than being stretched.
  useEffect(() => {
    const container = host.current;
    if (!container) return;

    let frame = 0;
    let last = container.clientWidth;
    const observer = new ResizeObserver(() => {
      if (container.clientWidth === last) return;
      last = container.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => void render());
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [render]);

  return (
    <div className={className}>
      {status === 'loading' ? (
        <div className="grid aspect-[210/297] w-full place-items-center">
          <span className="micro text-[10px] text-faint">Rendering...</span>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="grid aspect-[210/297] w-full place-items-center px-8 text-center">
          <p className="m-0 text-sm leading-[1.7] text-muted">
            The CV couldn't be rendered here. Use the download button above instead.
          </p>
        </div>
      ) : null}

      <div ref={host} />

      {status === 'ready' ? (
        <p className="sr-only">
          Curriculum vitae, {pages} page{pages === 1 ? '' : 's'}. Download the PDF for the
          full text.
        </p>
      ) : null}
    </div>
  );
}
