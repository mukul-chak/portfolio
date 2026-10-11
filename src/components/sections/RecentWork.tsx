import Rail from "@/components/layout/Rail";
import ProjectText from "@/components/sections/ProjectText";
import Filmstrip from "@/components/sections/Filmstrip";
import CarouselJunctionButton from "@/components/sections/CarouselJunctionButton";
import RuleAccordion from "@/components/ui/RuleAccordion";
import { projects } from "@/content/projects";

/**
 * Recent work: the projects, wrapped in an accordion titled by the section.
 *
 * The projects themselves are unchanged — each still owns its rail, its
 * filmstrip and the junction strokes between them. They're handed to the
 * accordion as children, which is also why this stays a server component:
 * only the accordion's own shell needs to be interactive.
 */
export default function RecentWork() {
  const [first, ...rest] = projects;
  return (
    <>
      {/* The bio's column verticals carry on through this gap and stop at the
          accordion's upper rule. This 120px used to be the heading block's
          own top padding inside the project rail; it stays ruled so the
          verticals meet that rule rather than ending in mid-air above it. */}
      <Rail elevateRule>
        <div className="h-[120px]" />
      </Rail>

      <RuleAccordion title="Recent work" anchorId="work">
        {/* pt-[40px] is the heading→title gap, carried by this rail now
            rather than by a wrapper inside the old shared one — so the
            rail's rule starts at the accordion's lower rule and the column
            verticals resume exactly there.
            pb-[20px] + Filmstrip's own pt-1 (4px, no rule) = 24px
            title→carousel gap, with the elevated rule covering the 20px and
            stopping 4px before the carousel. */}
        <CarouselJunctionButton>
          <Rail className="pt-[40px] pb-[20px]" elevateRule>
            <ProjectText project={first} />
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
      </RuleAccordion>

      {/* Empty for now — the bar, its chevron and the anchor exist so the
          nav has somewhere to land; the content comes later.
          sharesRuleAbove: whatever ends Recent work already draws this
          section's upper boundary — its lower rule when it's shut, its last
          project divider when it's open — so drawing another here would put
          two 1px lines against each other. */}
      <RuleAccordion title="About" anchorId="about" defaultOpen={false} sharesRuleAbove>
        {null}
      </RuleAccordion>
    </>
  );
}
