import { type Project } from "@/content/projects";
import SectionLabel from "@/components/ui/SectionLabel";
import Tabular from "@/components/ui/Tabular";

/**
 * Project copy block: the title, then its year and type on their own line
 * in the meta colour, at the body copy's 17/18px. Lives inside a Rail; the
 * title is leading-none so when it's the first element the inner rules
 * start at its ascenders.
 */
export default function ProjectText({
  project,
  meta,
  number,
}: {
  project: Project;
  meta: string;
  number?: string;
}) {
  return (
    <div>
      <h3 className="relative text-[17px] sm:text-[18px] font-medium leading-none text-text-strong-950">
        {/* In the left channel, mirroring the title: its right edge sits
            16px outside the column rule as the title sits 16px inside it
            (mr-8 = the rail's 16px padding + 16px). Absolute with no top,
            so it keeps its place on the title's line and shares its
            baseline. md and up, where the channel exists. */}
        {number && (
          <span aria-hidden className="absolute right-full mr-8 hidden whitespace-nowrap font-normal text-meta md:inline">
            <Tabular>{number}</Tabular>
          </span>
        )}
        {project.title}
      </h3>
      <SectionLabel className="text-meta mt-1 text-[17px] sm:text-[18px] leading-[1.5]">
        <Tabular>{meta}</Tabular>
      </SectionLabel>
    </div>
  );
}
