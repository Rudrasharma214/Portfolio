import { sections, skills } from '@/content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { RevealGroup } from '@/components/ui/Reveal';
import { TagList } from '@/components/ui/Tag';

export function Skills() {
  return (
    <section id="skills" className="py-16 lg:py-26">
      <Container>
        <SectionHeading meta={sections.skills} />

        <RevealGroup variant="up" step={80} className="grid gap-x-14 md:grid-cols-2">
          {skills.map((group) => (
            <div key={group.id} className="border-t border-line py-7">
              <h3 className="m-0 mb-5 text-lg font-normal">
                <span className="micro mr-4 text-[10px] text-gold">{group.index}</span>
                {group.title}
              </h3>
              <TagList items={group.items} className="gap-2" />
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
