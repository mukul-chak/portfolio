import { Fragment } from "react";
import Rail from "@/components/layout/Rail";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectText from "@/components/sections/ProjectText";
import Filmstrip from "@/components/sections/Filmstrip";
import * as Button from "@/components/ui/Button";
import { projects } from "@/content/projects";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

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
          {/* Centered exactly on the horizontal/vertical rule junction. Both
              rules render as a 1px line whose visual center sits half a
              pixel past its own top/left edge, hence the +0.5px nudge. */}
          <div className="absolute left-[0.5px] top-[120.5px] z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <Button.Root
              variant="neutral"
              mode="ghost"
              size="xs"
              square
              aria-label="Add"
              className="text-text-disabled-300 hover:bg-bg-weak-50 hover:text-text-soft-400"
            >
              <PlusIcon />
            </Button.Root>
          </div>
          {/* Inset 4px from the vertical rule on either side (Rail's own 16px
              padding pulled back with a negative margin) — the standard gap
              between a horizontal rule-t and the vertical rule it meets. */}
          <div className="mx-[-12px] rule-t" />
          <SectionLabel className="mt-1">Recent work</SectionLabel>
        </div>
        <div className="pt-[24px]">
          <ProjectText project={first} />
        </div>
        {/* Diagonally opposite the top-left plus: bottom-right junction of
            this rail's vertical rule and the solid divider Filmstrip draws
            above its carousel. 311px measured directly (divider's own
            center, not just its top) from this Rail's top edge — Filmstrip
            renders at frame width, wider than this rail, so the two lines
            cross rather than share an endpoint. */}
        <div className="absolute right-[0.5px] top-[311px] z-20 hidden translate-x-1/2 -translate-y-1/2 md:block">
          <Button.Root
            variant="neutral"
            mode="ghost"
            size="xs"
            square
            aria-label="Add"
            className="text-text-disabled-300 hover:bg-bg-weak-50 hover:text-text-soft-400"
          >
            <PlusIcon />
          </Button.Root>
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
