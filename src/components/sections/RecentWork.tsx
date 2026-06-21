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
      <Rail>
        <div className="pt-[120px]">
          <SectionLabel>Recent work</SectionLabel>
          <div className="mt-1 rule-t" />
        </div>
        <div className="pt-6">
          <ProjectText project={first} />
        </div>
      </Rail>
      <Filmstrip count={first.imageCount} />

      {rest.map((project) => (
        <Fragment key={project.slug}>
          <Rail className="mt-12">
            <ProjectText project={project} />
          </Rail>
          <Filmstrip count={project.imageCount} />
        </Fragment>
      ))}
    </>
  );
}
