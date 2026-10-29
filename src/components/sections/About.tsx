import { achievements, education, profile, sections } from '@/content';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Photo } from '@/components/ui/Photo';

export function About() {
  return (
    <section id="about" className="border-line bg-surface-2 border-y" aria-labelledby="about-title">
      <Container>
        <div className="grid gap-10 py-16 lg:grid-cols-[0.8fr_1.4fr] lg:gap-24 lg:py-26">
          <Reveal variant="left" duration={900}>
            <Photo
              asset={profile.photos.portrait}
              variant="portrait"
              className="mx-auto mb-8 max-w-[240px] lg:mx-0 lg:max-w-none"
            />

            <div className="micro text-accent-alt mb-4">
              {sections.about.index} / {sections.about.eyebrow}
            </div>
            <h2
              id="about-title"
              className="m-0 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] font-normal tracking-[-0.045em]"
            >
              {sections.about.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {achievements.chips.map((chip) => (
                <li
                  key={chip}
                  className="micro border-line-strong text-ink/70 rounded-full border px-3.5 py-2.5 text-[10px]"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="right" duration={900} delay={120}>
            <p className="m-0 mb-6 text-[22px] leading-[1.55] tracking-[-0.02em] sm:text-[26px]">
              {profile.about.statement} <span className="text-ink/55">{profile.about.lead}</span>
            </p>
            <p className="text-muted m-0 text-sm leading-[1.7]">{profile.about.detail}</p>

            <div className="border-line-strong mt-7 flex items-center gap-3.5 border-t pt-6">
              <span
                aria-hidden
                className="border-line-strong text-accent-alt grid size-11 shrink-0 place-items-center rounded-full border text-xl"
              >
                ⌘
              </span>
              <div>
                <h3 className="m-0 mb-1.5 text-sm font-normal">{education.institution}</h3>
                <p className="micro text-muted m-0 text-[10px] leading-[1.7]">
                  {education.degree} · {education.field} · {education.start}–{education.end}
                </p>
              </div>
            </div>

            <h3 className="micro text-accent-alt mt-7 mb-3 font-normal">Certifications</h3>
            <ul className="m-0 list-none p-0">
              {achievements.certifications.map((cert) => (
                <li key={cert} className="text-muted py-1 text-[13px]">
                  {cert}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
