import Button from "@/components/ui/Button";
import { type Project } from "@/content/projects";

/**
 * Project copy block (title, description, CTA). Lives inside a Rail; the title
 * is leading-none so when it's the first element the inner rules start at its
 * ascenders, and the button is last so the rules end at its bottom edge.
 */
export default function ProjectText({ project }: { project: Project }) {
  return (
    <div>
      <h3 className="text-[17px] font-bold leading-none text-heading">
        {project.title}
      </h3>
      <p className="mt-3 text-[17px] leading-[1.5] text-muted">
        {project.description}
      </p>
      <div className="mt-5 flex">
        <Button href={project.caseStudyHref}>Read case study</Button>
      </div>
    </div>
  );
}
