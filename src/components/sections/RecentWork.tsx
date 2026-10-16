import Rail from "@/components/layout/Rail";
import ProjectText from "@/components/sections/ProjectText";
import Filmstrip from "@/components/sections/Filmstrip";
import CarouselJunctionButton from "@/components/sections/CarouselJunctionButton";
import RuleAccordion, { AccordionRule } from "@/components/ui/RuleAccordion";
import Resume from "@/components/sections/Resume";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import * as Button from "@/components/ui/Button";
import { projects, type Project } from "@/content/projects";
import SectionLabel from "@/components/ui/SectionLabel";
import { EMAIL } from "@/content/site";

// Placeholder destinations — the real URLs land later. The email isn't
// here: it copies rather than navigates, so it's a button (see below).
const SOCIALS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "Are.na", href: "#" },
];

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
          <ProjectRail project={first} className="pt-[40px] pb-[20px]" />
          <Filmstrip count={first.imageCount} captions={first.captions} />
        </CarouselJunctionButton>

        {rest.map((project) => (
          // Not a bare Fragment — CarouselJunctionButton needs a real DOM
          // wrapper to (a) anchor its own rail/divider connectors and (b)
          // reach the PREVIOUS project's own wrapper via previousElementSibling
          // to bridge the divider that closes it, so the rule reads as one
          // continuous line across the project boundary, not two disjoint ones.
          <CarouselJunctionButton key={project.slug}>
            {/* mt-1 (4px, no rule) keeps the carousel's 4px stroke-gap above this rail;
                pt-[37px] is the rest of the 41px divider→title gap, covered by the
                elevated rule — the lower half of the space Filmstrip's closing
                divider splits evenly (see there). pb-[20px] does the same for THIS
                rail's own trailing gap down to its own carousel below (20px
                covered + Filmstrip's 4px = 24px). */}
            <ProjectRail project={project} className="mt-1 pt-[37px] pb-[20px]" />
            <Filmstrip count={project.imageCount} captions={project.captions} />
          </CarouselJunctionButton>
        ))}

        {/* The way into Experience, built like the way into Recent work: the
            last carousel closes on its divider like every other (the column
            rules now reach it, so it carries their junctions), then a ruled
            80px gap and a rule for Experience's bar to share. Inside the content, so with
            Recent work shut the two bars still stack on one line. */}
        <Rail elevateRule>
          <div className="h-[80px]" />
        </Rail>
        <AccordionRule />
      </RuleAccordion>

      {/* sharesRuleAbove: whatever ends Recent work already draws this
          section's upper boundary — its lower rule when it's shut, the rule
          closing its end gap when it's open — so drawing another here would
          put two 1px lines against each other. */}
      <RuleAccordion title="Experience" anchorId="experience" defaultOpen={false} sharesRuleAbove>
        <Resume />
        {/* Closes the section and gives the rail's verticals something to
            land on, as Contact's does. Inside the content, so it collapses
            with it rather than stranding a line under a shut accordion. */}
        <AccordionRule />
      </RuleAccordion>

      <RuleAccordion title="Contact" anchorId="contact" defaultOpen={false} sharesRuleAbove>
        {/* Ghost is the tertiary mode here — no container until hover,
            which is what the row should read as.
            px-2 against the default px-4, with the row pulled back by the
            same 8px: that lands the first label on the column's own text
            inset, level with the titles above it, while leaving the hover
            fill 8px clear of the column rule. At the default padding the
            fill would sit right on the rule. */}
        {/* A Rail, so the column verticals run down either side of the
            links the way they do beside every other block on the page.
            They start at the accordion's lower rule and terminate on the
            closing one below, rather than ending in mid-air. */}
        <Rail className="pt-4 pb-6" elevateRule>
          {/* Two aligned columns on mobile, one row from md.
              grid-cols-[max-content_1fr] rather than grid-cols-2: the first
              column sizes to the email, which is far the longest label and
              carries whitespace-nowrap from the button base, so equal
              halves would overflow it at 375px. This way the second column
              starts where the email ends and LinkedIn / Are.na line up,
              which plain flex-wrap never did. */}
          {/* justify-items-start: a grid item stretches to its cell by
              default, and Button.Root centres its own label, so the links
              sat centred in each column rather than flush left. */}
          <div className="-ml-2 grid grid-cols-[max-content_1fr] items-center justify-items-start gap-x-4 gap-y-0 md:flex md:flex-wrap md:gap-x-8">
            <CopyEmailButton label={EMAIL} className="h-8 px-2 font-normal" />
            {SOCIALS.map((c) => (
              <Button.Root
                key={c.label}
                asChild
                variant="neutral"
                mode="ghost"
                size="md"
                className="h-8 px-2 font-normal"
              >
                <a href={c.href}>{c.label}</a>
              </Button.Root>
            ))}
          </div>
        </Rail>
        {/* Closes the section, and gives the rail's verticals something to
            land on. Inside the content, so it collapses with it. */}
        <AccordionRule />
      </RuleAccordion>
    </>
  );
}

/**
 * A project's text rail, with its year and type laid out as Experience lays
 * out its dates: from lg in the frame's left channel on the title's
 * baseline (a frame-width grid, baseline-aligned, the column track the
 * Rail's own 620px), below lg in the eyebrow slot above the title.
 */
function ProjectRail({ project, className }: { project: Project; className: string }) {
  const meta = `${project.year} · ${project.type}`;
  return (
    <div className="lg:grid lg:grid-cols-[1fr_var(--container-column)_1fr] lg:items-baseline">
      {/* nowrap: "2025 · Product Design" is 139px against the channel's
          138 at exactly 1024, and wrapping there would leave "Design" on a
          second line below the title's baseline. Unwrapped it runs 1px into
          the 16px padding, still clear of the column rule. */}
      <SectionLabel className="text-meta hidden whitespace-nowrap px-4 tabular-nums lg:col-start-1 lg:row-start-1 lg:block">
        {meta}
      </SectionLabel>
      <Rail className={`${className} lg:col-start-2 lg:row-start-1 lg:w-full`} elevateRule>
        <SectionLabel className="text-meta mb-2 tabular-nums lg:hidden">{meta}</SectionLabel>
        <ProjectText project={project} />
      </Rail>
    </div>
  );
}
