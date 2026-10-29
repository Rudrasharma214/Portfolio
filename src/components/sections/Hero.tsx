import { Suspense, lazy } from 'react';
import { CV_PATH, profile, stats } from '@/content';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ButtonLink } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';
import { SceneFallback } from '@/components/three/SceneFallback';

// `three` is ~250KB gzipped — keep it out of the entry chunk so the headline paints first.
const HeroScene = lazy(() =>
  import('@/components/three/HeroScene').then((m) => ({ default: m.HeroScene })),
);

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <Container>
        <div className="grid min-h-[600px] items-center gap-12 py-12 lg:min-h-[650px] lg:grid-cols-[1.08fr_1fr] lg:gap-5 lg:py-16">
          <RevealGroup variant="up" step={110} className="relative z-10">
            <Eyebrow>
              {profile.name} / {profile.role}
            </Eyebrow>

            <h1
              id="hero-title"
              className="my-7 text-[clamp(3.4rem,6.8vw,6.4rem)] leading-[0.98] font-medium tracking-[-0.055em]"
            >
              {profile.headline.lead}
              <br />
              <em className="text-accent not-italic">{profile.headline.accent}</em>
            </h1>

            <p className="m-0 max-w-[430px] text-[15px] leading-[1.65] text-muted sm:text-[17px]">
              {profile.intro.map((line, i) => (
                <span key={line}>
                  {i === 0 ? <strong className="font-normal text-ink">{line}</strong> : line}{' '}
                </span>
              ))}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <ButtonLink href="#work">
                Explore my work <span aria-hidden>↘</span>
              </ButtonLink>
              <ButtonLink variant="quiet" href={CV_PATH} download className="whitespace-nowrap">
                Download CV <span aria-hidden>↓</span>
              </ButtonLink>
            </div>

            <div className="micro mt-10 flex flex-wrap gap-5 text-[10px] text-faint lg:mt-14">
              <span>Based in {profile.location}</span>
              <span>{profile.availability}</span>
            </div>
          </RevealGroup>

          <Reveal variant="scale" duration={1100} delay={180}>
            <Suspense fallback={<SceneFallback />}>
              <HeroScene />
            </Suspense>
          </Reveal>
        </div>

        <div className="micro hidden items-center gap-4 pt-3 pb-7 text-[10px] text-muted lg:flex">
          <span aria-hidden className="h-px w-7 bg-muted" />
          Scroll to explore ↓
        </div>
      </Container>

      <Container>
        <RevealGroup
          variant="up"
          step={80}
          className="grid grid-cols-2 gap-y-6 border-y border-line py-7 lg:grid-cols-5 lg:gap-y-0"
        >
          {stats.map((stat) => (
            <Stat key={stat.id} stat={stat} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
