import { copy } from "@/content/copy";

export const RESUME_FILENAME = "Mukul-Chakravarthi-Resume";

/**
 * The resume as Markdown, built from the same content as the page and the
 * PDF. Captions go in as an italic line under each org — the page shows
 * them on hover; a flat document has nowhere else to put them.
 */
export function resumeMarkdown() {
  const { site, experience, education, teaching, orgs } = copy;
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `${site.role} · ${site.email} · ${site.location}`,
    "",
    experience.summary,
    "",
    `## ${experience.title}`,
  ];
  for (const role of experience.roles) {
    lines.push(
      "",
      `### [${role.org}](${role.href}) — ${role.title}`,
      "",
      `${role.dates}  `,
      `*${orgs[role.id].preview}*`,
      "",
      ...role.points.map((p) => (role.points.length > 1 ? `- ${p}` : p)),
    );
  }
  for (const section of [education, teaching]) {
    lines.push("", `## ${section.title}`);
    for (const entry of section.entries) {
      lines.push(
        "",
        `### [${entry.org}](${entry.href}) — ${entry.detail}`,
        "",
        `${entry.dates}  `,
        `*${orgs[entry.id].preview}*`,
      );
    }
  }
  return lines.join("\n") + "\n";
}
