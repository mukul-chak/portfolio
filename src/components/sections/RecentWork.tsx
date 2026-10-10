import Rail from "@/components/layout/Rail";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectText from "@/components/sections/ProjectText";
import Filmstrip from "@/components/sections/Filmstrip";
import CarouselJunctionButton from "@/components/sections/CarouselJunctionButton";
import RuleJunction from "@/components/ui/RuleJunction";
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
      <CarouselJunctionButton>
        <Rail className="pb-[20px]" elevateRule>
          <div className="pt-[120px]">
            {/* Both ends of this rule, where it crosses the column verticals.
                top-[120.5px]: the rule starts at 120px (the pt above) and is
                1px tall, so its visual centre is 120.5. z-[15] matches the
                rule-x these sit on, so they fall under the bottom scroll fade
                exactly as the rules do; they still paint above the rule-x
                overlay, rendering later in Rail's own DOM order. */}
            <RuleJunction className="left-[0.5px] top-[120.5px] z-[15] -translate-x-1/2 -translate-y-1/2" />
            <RuleJunction className="right-[0.5px] top-[120.5px] z-[15] translate-x-1/2 -translate-y-1/2" />
            {/* Full 16px (Rail's own px-4) pulled back, not 4px short of it —
                this line needs to actually touch both vertical rules, not
                stop near them. */}
            <div className="mx-[-16px] rule-t" />
            <SectionLabel className="mt-1">Recent work</SectionLabel>
          </div>
          <div className="pt-[40px]">
            <ProjectText project={first} />
          </div>
        </Rail>
        <Filmstrip count={first.imageCount} captions={first.captions} />
      </CarouselJunctionButton>

      {rest.map((project, i) => (
        // Not a bare Fragment — CarouselJunctionButton needs a real DOM
        // wrapper to (a) anchor its own rail/divider connectors and (b)
        // reach the PREVIOUS project's own wrapper via previousElementSibling
        // to bridge the divider that closes it, so the rule reads as one
        // continuous line across the project boundary, not two disjoint ones.
        <CarouselJunctionButton key={project.slug}>
          {/* mt-1 (4px, no rule) keeps the carousel's 4px stroke-gap above this rail;
              pt-[68px] is the rest of the 72px carousel→title gap, covered by the
              elevated rule. pb-[20px] does the same for THIS rail's own trailing
              gap down to its own carousel below (20px covered + Filmstrip's 4px = 24px). */}
          <Rail className="mt-1 pt-[68px] pb-[20px]" elevateRule>
            <ProjectText project={project} />
          </Rail>
          <Filmstrip
            count={project.imageCount}
            captions={project.captions}
            last={i === rest.length - 1}
          />
        </CarouselJunctionButton>
      ))}
    </>
  );
}
