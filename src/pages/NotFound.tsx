import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta('Not found — Rudra Sharma');

  return (
    <PageShell>
      <section className="grid min-h-[60vh] place-items-center py-20">
        <Container className="text-center">
          <Eyebrow className="justify-center">Error 404</Eyebrow>
          <h1 className="mt-6 mb-4 text-[clamp(3rem,10vw,6rem)] leading-none font-medium tracking-[-0.05em]">
            Not <span className="text-accent">found.</span>
          </h1>
          <p className="text-muted mx-auto mb-8 max-w-sm text-sm leading-[1.7]">
            That route doesn't exist. Nothing is on fire — the request just didn't match anything.
          </p>
          <Link
            to="/"
            className="border-accent bg-accent text-bg hover:bg-accent-soft inline-flex items-center gap-3 rounded border px-6 py-4 text-[13px] font-bold transition-colors"
          >
            Back to portfolio <span aria-hidden>→</span>
          </Link>
        </Container>
      </section>
    </PageShell>
  );
}
