import { roles, education, teaching, summary } from "@/content/resume";
import { PREVIEW_CAPTIONS } from "@/content/previews";
import { EMAIL, LOCATION } from "@/content/site";

export const RESUME_NAME = "Mukul Chakravarthi";
export const RESUME_ROLE = "Product Designer";
export const RESUME_FILENAME = "Mukul-Chakravarthi-Resume";

/**
 * The resume as Markdown, built from the same content as the page and the
 * PDF. Captions go in as an italic line under each org — the page shows
 * them on hover; a flat document has nowhere else to put them.
 */
export function resumeMarkdown() {
  const lines: string[] = [
    `# ${RESUME_NAME}`,
    "",
    `${RESUME_ROLE} · ${EMAIL} · ${LOCATION}`,
    "",
    summary,
    "",
    "## Experience",
  ];
  for (const role of roles) {
    lines.push(
      "",
      `### [${role.org}](${role.href}) — ${role.title}`,
      "",
      `${role.dates}  `,
      `*${PREVIEW_CAPTIONS[role.id]}*`,
      "",
      ...role.points.map((p) => (role.points.length > 1 ? `- ${p}` : p)),
    );
  }
  for (const [label, items] of [
    ["Education", education],
    ["Teaching", teaching],
  ] as const) {
    lines.push("", `## ${label}`);
    for (const entry of items) {
      lines.push(
        "",
        `### [${entry.org}](${entry.href}) — ${entry.detail}`,
        "",
        `${entry.dates}  `,
        `*${PREVIEW_CAPTIONS[entry.id]}*`,
      );
    }
  }
  return lines.join("\n") + "\n";
}
