import { type Project } from "@/content/projects";
import SectionLabel from "@/components/ui/SectionLabel";
import Tabular from "@/components/ui/Tabular";

/**
 * Project copy block: the title, then its year and type on their own line
 * in the meta colour, at the body copy's 17/18px. Lives inside a Rail; the
 * title is leading-none so when it's the first element the inner rules
 * start at its ascenders.
 */
export default function ProjectText({ project, meta }: { project: Project; meta: string }) {
  return (
    <div>
      <h3 className="text-[17px] sm:text-[18px] font-medium leading-none text-text-strong-950">
        {project.title}
      </h3>
      <SectionLabel className="text-meta mt-1 text-[17px] sm:text-[18px] leading-[1.5]">
        <Tabular>{meta}</Tabular>
      </SectionLabel>
    </div>
  );
}
