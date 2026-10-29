import { profile, sections } from '@/content';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Photo } from '@/components/ui/Photo';

export function Contact({ onToast }: { onToast: (message: string) => void }) {
  const copy = useCopyToClipboard();

  const handleCopy = async () => {
    const ok = await copy(profile.email);
    onToast(ok ? 'Email copied' : `Email: ${profile.email}`);
  };

  return (
    <section
      id="contact"
      className="border-line border-t py-16 lg:pt-21 lg:pb-16"
      aria-labelledby="contact-title"
    >
      <Container>
        <Reveal variant="scale" duration={900} className="flex items-center justify-between gap-12">
          <div>
            <div className="micro text-gold mb-4">
              {sections.contact.index} / {sections.contact.eyebrow}
            </div>
            <h2
              id="contact-title"
              className="my-6 text-[clamp(2.75rem,6.4vw,5.4rem)] leading-[1.06] font-normal tracking-[-0.05em]"
            >
              {sections.contact.title.map((line, i) => (
                <span key={line} className={i === 1 ? 'text-orange block' : 'block'}>
                  {line}
                </span>
              ))}
            </h2>

            <a
              href={`mailto:${profile.email}`}
              className="border-faint hover:text-orange inline-flex items-center gap-4 border-b pb-2 text-sm transition-colors sm:gap-8 sm:text-[17px]"
            >
              {profile.email} <span aria-hidden>↗</span>
            </a>

            <div className="text-muted mt-5 flex flex-wrap items-center gap-6 text-[13px]">
              <button type="button" onClick={handleCopy} className="hover:text-orange">
                Copy email <span aria-hidden>⧉</span>
              </button>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="hover:text-orange">
                {profile.phone} <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* The ring rotates; the photo inside it never does. */}
          <div className="relative hidden size-[220px] shrink-0 place-items-center lg:grid">
            <span
              aria-hidden
              className="border-line-strong absolute -inset-5 animate-[ring_40s_linear_infinite] rounded-full border border-dashed"
            />
            <Photo asset={profile.photos.contact} variant="round" className="size-[220px]" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
