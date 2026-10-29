import { useState } from 'react';
import type { Project } from '@/types/content';
import { projects, sections } from '@/content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { RevealGroup } from '@/components/ui/Reveal';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';

export function Work() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="work" className="py-16 lg:py-26">
      <Container>
        <SectionHeading meta={sections.work} />

        {/* auto-fit rather than fixed columns, so adding a third project to
            projects.json reflows without touching this file. */}
        <RevealGroup
          variant="up"
          step={110}
          className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={setActive} />
          ))}
        </RevealGroup>
      </Container>

      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </section>
  );
}
