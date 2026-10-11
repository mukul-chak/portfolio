import Rail from "@/components/layout/Rail";
import SectionLabel from "@/components/ui/SectionLabel";
import { summary, roles, education, capabilities } from "@/content/resume";

/**
 * The About section's content: a resume, set in the page's own language.
 *
 * Each role borrows the project blocks' shape — an eyebrow, an 18px medium
 * title, then supporting copy — so a reader moving down the page meets the
 * same rhythm twice rather than two different documents. The dates take the
 * eyebrow slot that the project numbers take, which is also what makes the
 * list scannable by date without a second column fighting for width.
 *
 * Inside a Rail, so the column verticals carry through the section as they
 * do beside every other block.
 */
export default function Resume() {
  return (
    <Rail className="pt-8 pb-10" elevateRule>
      <p className="text-[18px] leading-[1.5] text-text-sub-600">{summary}</p>

      {roles.map((role) => (
        <div key={`${role.org}-${role.title}`} className="mt-10">
          <div className="mx-[-16px] rule-t" />
          <SectionLabel className="mt-4 tabular-nums">{role.dates}</SectionLabel>
          <h3 className="mt-2 text-[18px] font-medium leading-none text-text-strong-950">
            {role.org}
          </h3>
          <p className="mt-1 text-[18px] leading-[1.5] text-text-sub-600">
            {role.title}
          </p>
          {role.context && (
            <p className="mt-3 text-[16px] leading-[1.6] text-text-soft-400">
              {role.context}
            </p>
          )}
          <ul className="mt-3 space-y-2">
            {role.points.map((point) => (
              // Hanging indent rather than a list marker: the page has no
              // bullets anywhere else, and a marker column would break the
              // left edge every other block shares.
              <li
                key={point}
                className="text-[16px] leading-[1.6] text-text-sub-600"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-10">
        <div className="mx-[-16px] rule-t" />
        <SectionLabel className="mt-4">Education</SectionLabel>
        <h3 className="mt-2 text-[18px] font-medium leading-none text-text-strong-950">
          {education.org}
        </h3>
      </div>

      <div className="mt-10">
        <div className="mx-[-16px] rule-t" />
        <SectionLabel className="mt-4">Capabilities</SectionLabel>
        <p className="mt-2 text-[16px] leading-[1.6] text-text-sub-600">
          {capabilities.join(" · ")}
        </p>
      </div>
    </Rail>
  );
}
