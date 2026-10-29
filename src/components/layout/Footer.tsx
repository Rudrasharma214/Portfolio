import { profile, socials } from '@/content';
import { Container } from '@/components/ui/Container';
import { MotionToggle } from '@/components/ui/MotionToggle';

export function Footer() {
  return (
    <footer className="border-line border-t py-6">
      <Container>
        <div className="micro text-muted flex flex-wrap items-center justify-between gap-5 text-[10px]">
          <span className="w-full sm:w-auto">
            © {new Date().getFullYear()} {profile.name}
          </span>

          <div className="flex gap-6">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {social.label} ↗
              </a>
            ))}
            <a href="#top" className="hover:text-accent transition-colors">
              Back to top ↑
            </a>
          </div>

          <MotionToggle />
        </div>
      </Container>
    </footer>
  );
}
