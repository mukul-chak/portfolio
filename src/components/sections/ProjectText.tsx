import * as Button from "@/components/ui/Button";
import { type Project } from "@/content/projects";

/**
 * Project copy block (title, description, CTA). Lives inside a Rail; the title
 * is leading-none so when it's the first element the inner rules start at its
 * ascenders, and the button is last so the rules end at its bottom edge.
 */
export default function ProjectText({ project }: { project: Project }) {
  return (
    <div>
      <h3 className="text-[18px] font-medium leading-none text-text-strong-950">
        {project.title}
      </h3>
      <p className="mt-1 text-[18px] leading-[1.5] text-text-soft-400">
        {project.description}
      </p>
      <div className="mt-3 flex">
        <Button.Root
          asChild
          variant="neutral"
          mode="link"
          className="font-[family-name:var(--font-eyebrow)] font-medium text-[17px] text-text-sub-600"
        >
          <a href={project.caseStudyHref}>Read case study</a>
        </Button.Root>
      </div>
    </div>
  );
}
