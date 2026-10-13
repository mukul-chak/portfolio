"use client";

import { Fragment } from "react";
import Rail from "@/components/layout/Rail";
import InlineLink from "@/components/ui/InlineLink";
import { useHoverPreview } from "@/components/ui/HoverPreview";
import SectionLabel from "@/components/ui/SectionLabel";
import ResumeExport from "@/components/sections/ResumeExport";
import { summary, roles, education } from "@/content/resume";

const PREVIEW_ORDER = [...roles.map((r) => r.id), ...education.map((s) => s.id)];

// Titles keep their strong-950 at rest; InlineLink supplies the underline,
// the hover darkening and the focus ring, as it does in the bio.
const TITLE_LINK = "text-text-strong-950";

const ENTRY_TEXT = "text-[17px] sm:text-[18px] leading-[1.5] text-text-sub-600";

/**
 * The Experience section's content: a resume, set in the page's own language.
 *
 * From lg each role's dates sit in the frame's left channel, set on the
 * title's baseline, so the column holds only the entry and the channel
 * reads as a timeline down the left edge. A Rail is column-width and can't
 * reach the channel, so each role is its own frame-width grid —
 * channel / column / channel, the column track the same 620px the Rail
 * would centre itself in, so the column rules land where they always did.
 * Grid baseline alignment does the baseline work: the Rail's first
 * baseline is the title (the rule-t above it has no line box), so the
 * dates align to it without a hand-tuned offset.
 *
 * Below lg the channel is too narrow for "2024–Present", so the dates go
 * back to the eyebrow slot above the title.
 *
 * Rails are stacked flush, spacing as padding rather than margin, so the
 * column verticals run unbroken through the section. The spacing sits at
 * the bottom of each Rail so the next one starts on its rule-t: each
 * Rail's dotted pattern restarts at its top, and a join left in open
 * space showed as a broken 4/2 rhythm. On the horizontal rule it reads as
 * a junction, like every other one on the page.
 */
export default function Resume() {
  const preview = useHoverPreview(PREVIEW_ORDER);

  return (
    <div className="relative">
      <Rail className="pt-8 pb-10" elevateRule>
        {/* Below lg there's no channel, so the export sits above the
            summary, as the dates sit above their titles. */}
        <div className="mb-2 lg:hidden">
          <ResumeExport />
        </div>
        <p className={ENTRY_TEXT}>{summary}</p>
      </Rail>

      {roles.map((role) => (
        <div
          key={`${role.org}-${role.title}`}
          className="lg:grid lg:grid-cols-[1fr_var(--container-column)_1fr] lg:items-baseline"
        >
          <SectionLabel className="hidden px-4 tabular-nums lg:col-start-1 lg:row-start-1 lg:block">
            {role.dates}
          </SectionLabel>
          <Rail className="pb-10 lg:col-start-2 lg:row-start-1 lg:w-full" elevateRule>
            <div className="mx-[-16px] rule-t" />
            <SectionLabel className="mt-4 tabular-nums lg:hidden">{role.dates}</SectionLabel>
            <h3 className="mt-2 text-[17px] sm:text-[18px] font-medium leading-none text-text-strong-950 lg:mt-4">
              <InlineLink
                href={role.href}
                external
                onMouseEnter={preview.show(role.id)}
                onMouseLeave={preview.hide}
                className={`${TITLE_LINK} ${preview.raised(role.id)}`}
              >
                {role.org}
              </InlineLink>
            </h3>
            <p className={`mt-1 ${ENTRY_TEXT}`}>{role.title}</p>
            <ul className="mt-3 space-y-2">
              {role.points.map((point) => (
                <li
                  key={point}
                  className={`${ENTRY_TEXT} ${role.points.length > 1 ? "relative pl-4" : ""}`}
                >
                  {/* Bulleted only when there's more than one point. The
                      bullet sits on the column's 16px inset, inside the
                      padding rather than hung into it, and the text indents
                      past it. A drawn span rather than list-disc, so its
                      position is set here rather than by the browser. */}
                  {role.points.length > 1 && (
                    <span aria-hidden className="absolute left-0 top-0">
                      •
                    </span>
                  )}
                  {point}
                </li>
              ))}
            </ul>
          </Rail>
        </div>
      ))}

      {/* Education takes the roles' layout: dates in the channel on each
          school's baseline from lg, above the name below it. Unlike the
          roles there's no rule-t between schools, so one Rail per school
          would put a join — and a restart of the dotted pattern — in open
          space. So the block is one grid, every school and date a direct
          item (a subgrid'd Rail kept the rows but Chrome doesn't share
          baselines out of a subgrid — the dates sat 5.5 and 13.5px high),
          and the verticals are one Rail-style overlay: absolute, so from lg
          its containing block is the column's grid area across every row.
          Below lg this element is itself the Rail: column-width, px-4. */}
      <div
        className="relative mx-auto max-w-column px-4 lg:grid lg:max-w-none lg:grid-cols-[1fr_var(--container-column)_1fr] lg:items-baseline lg:px-0"
        style={{ gridTemplateRows: `repeat(${education.length + 1}, auto)` }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[15] hidden rule-x md:block lg:col-[2/3] lg:row-[1/-1]"
        />
        <div className="lg:col-start-2 lg:row-start-1 lg:px-4">
          <div className="mx-[-16px] rule-t" />
          <SectionLabel className="mt-4">Education</SectionLabel>
        </div>
        {education.map((school, i) => (
          <Fragment key={school.org}>
            <div className="hidden lg:col-start-1 lg:block" style={{ gridRow: i + 2 }}>
              <SectionLabel className="px-4 tabular-nums">{school.dates}</SectionLabel>
            </div>
            <div
              className={`lg:col-start-2 lg:px-4 ${i === 0 ? "mt-2" : "mt-4"} ${
                i === education.length - 1 ? "pb-10" : ""
              }`}
              style={{ gridRow: i + 2 }}
            >
              <SectionLabel className="tabular-nums lg:hidden">{school.dates}</SectionLabel>
              <h3 className="mt-2 text-[17px] sm:text-[18px] font-medium leading-none text-text-strong-950 lg:mt-0">
                <InlineLink
                  href={school.href}
                  external
                  onMouseEnter={preview.show(school.id)}
                  onMouseLeave={preview.hide}
                  className={`${TITLE_LINK} ${preview.raised(school.id)}`}
                >
                  {school.org}
                </InlineLink>
              </h3>
              <p className={`mt-1 ${ENTRY_TEXT}`}>{school.degree}</p>
            </div>
          </Fragment>
        ))}
      </div>

      {/* From lg the export lives in the left channel, sticky for as long
          as the resume is on screen. The track spans the whole resume, from
          the frame edge to the column's left rule (50% − half the column),
          and the button sticks within it: it holds 45px down — just under
          the sticky header — and leaves with the resume's last entry, then
          scrolls on with the section like everything else.

          The sticky box repeats the summary's pt-8 and its 18px / 1.5 line
          box, so the inline-block button sits on the same baseline as the
          summary's first line without an offset. Left-aligned, 16px in from
          the outer rule, on the dates' edge.

          The dates share that edge, so the box is a page-coloured strip
          they scroll under, as content does under the header; pb-2 keeps a
          date from being cut right at the button's bottom. It sits below
          the rules' layers (z-15 column, z-17 outer), so both stay drawn
          over it. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden lg:block"
        style={{ right: "calc(50% + var(--container-column) / 2)" }}
      >
        <div className={`pointer-events-auto sticky top-[45px] bg-background px-4 pt-8 pb-2 ${ENTRY_TEXT}`}>
          <ResumeExport />
        </div>
      </div>

      {preview.panel}
    </div>
  );
}
