import { experience, sections } from '@/content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { RevealGroup } from '@/components/ui/Reveal';
import { ExperienceItem } from './ExperienceItem';

export function Experience() {
  return (
    <section id="experience" className="pb-16 lg:pb-26">
      <Container>
        <SectionHeading meta={sections.experience} />

        <RevealGroup variant="up" step={120} className="border-t border-line">
          {experience.map((item, i) => (
            // The current role starts expanded; history stays collapsed.
            <ExperienceItem key={item.id} item={item} open={i === 0} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
