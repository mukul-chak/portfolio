"use client";

import Rail from "@/components/layout/Rail";
import InlineLink from "@/components/ui/InlineLink";
import { useHoverPreview } from "@/components/ui/HoverPreview";
import SectionLabel from "@/components/ui/SectionLabel";
import Tabular from "@/components/ui/Tabular";
import ResumeExport from "@/components/sections/ResumeExport";
import { summary, teachingSummary, roles, teaching, type ListEntry } from "@/content/resume";

// Titles keep their strong-950 at rest; InlineLink supplies the underline,
// the hover darkening and the focus ring, as it does in the bio.
const TITLE_LINK = "text-text-strong-950";

const ENTRY_TEXT = "text-[17px] sm:text-[18px] leading-[1.5] text-text-sub-600";

// The page says "Now" where the PDF says "Present".
const siteDates = (dates: string) => dates.replace("Present", "Now");

/**
 * The Experience section's content: a resume, set in the page's own
 * language, and deliberately pithy — company, title, years, nothing else.
 * The full history (points, captions) lives in the downloadable PDF.
 *
 * Every entry is one row, as on Frank Chimero's: the company on the left
 * with its years flush right on the same baseline (items-baseline), the
 * title beneath, a rule between rows. The years keep their 16px Monument
 * in the meta colour. A long name wraps under itself; the years stay on its
 * first line.
 *
 * Rows are Rails stacked flush, each opening on its own rule-t, so the
 * column verticals run unbroken and every join lands on a rule. 16px above
 * and below the content keeps the whole history readable at a glance.
 */
export default function Resume() {
  const preview = useHoverPreview();

  return (
    <div className="relative">
      <Rail className="pt-8 pb-10" elevateRule>
        <p className={ENTRY_TEXT}>{summary}</p>
        {/* Under the summary at every width, with the summary's own 40px
            (pb-10) still between it and the first row's rule. */}
        <div className={`mt-4 ${ENTRY_TEXT}`}>
          <ResumeExport />
        </div>
      </Rail>

      {roles.map((role) => (
        <EntryRow
          key={`${role.org}-${role.title}`}
          org={role.siteOrg ?? role.org}
          href={role.href}
          id={role.id}
          dates={siteDates(role.dates)}
          detail={role.siteTitle ?? role.title}
          preview={preview}
        />
      ))}

      {preview.panel}
    </div>
  );
}

/**
 * The Teaching accordion's content, built like Experience: a short opening
 * paragraph, then the same rows.
 */
export function Teaching() {
  const preview = useHoverPreview();
  return (
    <div className="relative">
      <Rail className="pt-8 pb-10" elevateRule>
        <p className={ENTRY_TEXT}>{teachingSummary}</p>
      </Rail>
      {teaching.map((entry) => (
        <EntryRow
          key={entry.org}
          org={entry.siteOrg ?? entry.org}
          href={entry.href}
          id={entry.id}
          dates={siteDates(entry.dates)}
          detail={entry.detail}
          preview={preview}
        />
      ))}
      {preview.panel}
    </div>
  );
}

/**
 * One resume row: company (linked, with its hover note) and years on one
 * baseline, the title or degree beneath, opening on a rule.
 */
function EntryRow({
  org,
  href,
  id,
  dates,
  detail,
  preview,
}: {
  org: string;
  href: string;
  id: ListEntry["id"];
  dates: string;
  detail: string;
  preview: ReturnType<typeof useHoverPreview>;
}) {
  return (
    // Optically 16px above and below: rule to the company's cap height,
    // and the title's baseline to the next rule. The row's line box is the
    // years' 24px (the name, leading-none, sits on its baseline 3px down)
    // and the caps start 5.4px into it, so 10.5px of margin lands them at
    // 15.9; the title's baseline sits 7px above its line box's bottom, so
    // 9px of padding puts 16 under it. Descenders hang into that space.
    <Rail className="pb-[9px]" elevateRule>
      <div className="mx-[-16px] rule-t" />
      <div className="mt-[10.5px] flex items-baseline justify-between gap-4">
        <h3 className="min-w-0 text-[17px] sm:text-[18px] font-medium leading-none text-text-strong-950">
          <InlineLink
            href={href}
            external
            onMouseEnter={preview.show(id)}
            onMouseLeave={preview.hide}
            className={`${TITLE_LINK} ${preview.raised(id)}`}
          >
            {org}
          </InlineLink>
        </h3>
        <SectionLabel className="text-meta shrink-0">
          <Tabular>{dates}</Tabular>
        </SectionLabel>
      </div>
      {/* The title or degree in the years' meta colour, so the row reads
          as the company plus two quieter facts about it. */}
      <p className="mt-1 text-[17px] sm:text-[18px] leading-[1.5] text-meta">{detail}</p>
    </Rail>
  );
}
