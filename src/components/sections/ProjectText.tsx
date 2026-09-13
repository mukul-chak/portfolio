import { type Project } from "@/content/projects";

/**
 * Project copy block (title, description). Lives inside a Rail; the title
 * is leading-none so when it's the first element the inner rules start at
 * its ascenders.
 */
export default function ProjectText({ project }: { project: Project }) {
  return (
    <div>
      <h3 className="text-[18px] font-medium leading-none text-text-strong-950">
        {project.title}
      </h3>
      <p className="mt-1 text-[18px] leading-[1.5] text-text-sub-600">
        {project.description}
      </p>
    </div>
  );
}
