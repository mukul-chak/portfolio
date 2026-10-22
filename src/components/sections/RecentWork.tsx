import Rail from "@/components/layout/Rail";
import ProjectText from "@/components/sections/ProjectText";
import Filmstrip from "@/components/sections/Filmstrip";
import CarouselJunctionButton from "@/components/sections/CarouselJunctionButton";
import RuleAccordion, { AccordionRule } from "@/components/ui/RuleAccordion";
import Resume, { Teaching } from "@/components/sections/Resume";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import * as Button from "@/components/ui/Button";
import { projects, type Project } from "@/content/projects";
import { EMAIL } from "@/content/site";

// Placeholder destinations — the real URLs land later. The email isn't
// here: it copies rather than navigates, so it's a button (see below).
const SOCIALS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "Are.na", href: "#" },
];

/**
 * Work: the projects, wrapped in an accordion titled by the section.
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

      <RuleAccordion title="Work" anchorId="work">
        {/* Each project's title block sits optically 32px from the line
            above and the divider below: line to the title's cap height, and
            the year · type baseline to the divider. The title's caps start
            2.9px into its box, so 29px of padding lands them at 31.9; the
            label's baseline sits 7.5px above its 27px line box's bottom, so
            pb-[20.5px] + Filmstrip's own pt-1 (4px, no rule) puts 32 under
            it. The rail's rule starts at the accordion's lower rule, so the
            column verticals resume exactly there. */}
        <CarouselJunctionButton>
          <ProjectRail project={first} className="pt-[29px] pb-[20.5px]" />
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
                pt-[25px] is the rest of the 29px divider→title box, so the caps
                sit optically 32px below the divider, as the first project's sit
                below the bar (see above). pb-[20.5px] likewise. The captions
                above the divider sit 24px over it (Filmstrip). */}
            <ProjectRail project={project} className="mt-1 pt-[25px] pb-[20.5px]" />
            <Filmstrip count={project.imageCount} captions={project.captions} />
          </CarouselJunctionButton>
        ))}

        {/* The way into Experience, built like the way into Work: the
            last carousel closes on its divider like every other (the column
            rules now reach it, so it carries their junctions), then a ruled
            56px gap — the same as Contact's above the footer — and a rule
            for Experience's bar to share. Inside the content, so with
            Work shut the two bars still stack on one line. */}
        <Rail elevateRule>
          <div className="h-14" />
        </Rail>
        <AccordionRule />
      </RuleAccordion>

      {/* sharesRuleAbove: whatever ends Work already draws this
          section's upper boundary — its lower rule when it's shut, the rule
          closing its end gap when it's open — so drawing another here would
          put two 1px lines against each other. */}
      <RuleAccordion title="Experience" anchorId="experience" defaultOpen={false} sharesRuleAbove>
        <Resume />
        <SectionEnd />
        {/* Closes the section and gives the rail's verticals something to
            land on, as Contact's does. Inside the content, so it collapses
            with it rather than stranding a line under a shut accordion. */}
        <AccordionRule />
      </RuleAccordion>

      <RuleAccordion title="Teaching" anchorId="teaching" defaultOpen={false} sharesRuleAbove>
        <Teaching />
        <SectionEnd />
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

/** A project's text rail: title, with its year · type beneath it. */
function ProjectRail({ project, className }: { project: Project; className: string }) {
  return (
    <Rail className={className} elevateRule>
      <ProjectText project={project} meta={`${project.year} · ${project.type}`} />
    </Rail>
  );
}

/**
 * The gap that ends a list section, as Work ends: the last row closes on
 * its rule, then a ruled 56px gap (Contact's, above the footer) down to
 * the rule the next bar shares.
 * Inside the accordion's content, so it collapses with it.
 */
function SectionEnd() {
  return (
    <Rail elevateRule>
      <div className="mx-[-16px] rule-t" />
      <div className="h-14" />
    </Rail>
  );
}
