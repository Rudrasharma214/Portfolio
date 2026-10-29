import type { Project } from '@/types/content';
import { Modal } from '@/components/ui/Modal';
import { TagList } from '@/components/ui/Tag';
import { ButtonLink } from '@/components/ui/Button';

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <Modal open={project !== null} onClose={onClose} labelledBy="project-dialog-title">
      {project ? (
        <div className="p-7 sm:p-10">
          <div className="flex items-center justify-between">
            <span className="micro text-gold">Selected project</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="border-line hover:border-orange hover:text-orange grid size-9 place-items-center rounded-full border text-xl transition-colors"
            >
              ×
            </button>
          </div>

          <h2
            id="project-dialog-title"
            className="mt-6 mb-3 text-[2rem] font-normal tracking-[-0.04em] sm:text-[2.4rem]"
          >
            {project.name}
          </h2>
          <p className="text-ink/75 m-0 text-sm leading-[1.8]">{project.tagline}</p>

          <h3 className="micro text-gold mt-7 mb-2 font-normal">How it works</h3>
          <ul className="m-0 list-disc pl-5">
            {project.points.map((point) => (
              <li key={point} className="text-ink/75 py-1 text-sm leading-[1.8]">
                {point}
              </li>
            ))}
          </ul>

          <TagList items={project.tags} className="mt-7" />

          {project.repo ? (
            <ButtonLink
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7"
            >
              View on GitHub <span aria-hidden>↗</span>
            </ButtonLink>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
