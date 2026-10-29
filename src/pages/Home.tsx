import { seo } from '@/content';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useToast } from '@/hooks/useToast';
import { PageShell } from '@/components/layout/PageShell';
import { Toast } from '@/components/ui/Toast';
import { Hero } from '@/components/sections/Hero';
import { Work } from '@/components/sections/Work';
import { Experience } from '@/components/sections/Experience';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  const { message, show } = useToast();
  useDocumentMeta(seo.title, seo.description);

  return (
    <PageShell>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Skills />
      <Contact onToast={show} />
      <Toast message={message} />
    </PageShell>
  );
}
