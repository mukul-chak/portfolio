import { Fragment } from "react";
import Rail from "@/components/layout/Rail";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectText from "@/components/sections/ProjectText";
import Filmstrip from "@/components/sections/Filmstrip";
import { projects } from "@/content/projects";

/**
 * Recent work: the section heading + first project share a rail (continuing the
 * inner rules from the bio). Each project's filmstrip breaks the rail; the next
 * project starts a fresh rail whose rules begin at its title.
 */
export default function RecentWork() {
  const [first, ...rest] = projects;
  return (
    <>
      {/* pb-[20px] + Filmstrip's own pt-1 (4px, no rule) = 24px title→carousel gap,
          with the elevated rule covering the 20px and stopping 4px before the carousel. */}
      <Rail className="pb-[20px]" elevateRule>
        <div className="pt-[120px]">
          <div className="rule-t" />
          <SectionLabel className="mt-1">Recent work</SectionLabel>
        </div>
        <div className="pt-[24px]">
          <ProjectText project={first} />
        </div>
      </Rail>
      <Filmstrip count={first.imageCount} captions={first.captions} />

      {rest.map((project) => (
        <Fragment key={project.slug}>
          {/* mt-1 (4px, no rule) keeps the carousel's 4px stroke-gap above this rail;
              pt-[68px] is the rest of the 72px carousel→title gap, covered by the
              elevated rule. pb-[20px] does the same for THIS rail's own trailing
              gap down to its own carousel below (20px covered + Filmstrip's 4px = 24px). */}
          <Rail className="mt-1 pt-[68px] pb-[20px]" elevateRule>
            <ProjectText project={project} />
          </Rail>
          <Filmstrip count={project.imageCount} captions={project.captions} />
        </Fragment>
      ))}
    </>
  );
}
