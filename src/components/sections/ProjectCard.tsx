import type { Project } from '@/types/content';
import { TagList } from '@/components/ui/Tag';
import { ProjectArt } from './ProjectArt';

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  return (
    <article className="group border-line bg-surface hover:border-line-strong overflow-hidden rounded-lg border transition-[transform,border-color] duration-300 hover:-translate-y-1.5">
      <div className="relative">
        <ProjectArt variant={project.art} />
        <span className="micro text-muted absolute top-5 left-5 text-[9px]">
          {project.artLabel}
        </span>
        <span className="micro text-muted absolute right-5 bottom-5 text-[9px]">
          {project.artCaption}
        </span>
      </div>

      <div className="p-6">
        <div className="micro text-muted flex justify-between text-[10px]">
          <span>Project / {project.index}</span>
          <span className="text-accent-alt">{project.status === 'live' ? 'Live ↗' : 'WIP'}</span>
        </div>

        <h3 className="mt-4 mb-2 text-2xl font-normal tracking-[-0.03em]">{project.name}</h3>
        <p className="text-muted m-0 mb-5 text-[13px] leading-[1.7]">{project.summary}</p>

        <TagList items={project.tags.slice(0, 4)} />

        <div className="border-line mt-6 flex justify-between border-t pt-4 text-[11px]">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="hover:text-accent transition-colors"
          >
            Explore project <span aria-hidden>+</span>
          </button>
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              GitHub ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
