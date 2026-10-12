/**
 * Writes the resume exports to public/ — the PDF and the Markdown the
 * About section's export menu links to. Runs before `next dev` and
 * `next build` (see package.json), so the files exist wherever the site
 * does and always match the content they're built from.
 *
 * A script rather than a route handler: App Router routes run on Next's
 * bundled React, which @react-pdf/renderer (on the project's React) can't
 * render — elements from one React aren't valid children of the other.
 * Out here there's only one React.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import ResumePdf from "@/lib/ResumePdf";
import { RESUME_FILENAME, resumeMarkdown } from "@/lib/resumeExport";

const out = path.join(process.cwd(), "public", RESUME_FILENAME);

await renderToFile(<ResumePdf />, `${out}.pdf`);
await writeFile(`${out}.md`, resumeMarkdown());
console.log(`resume: wrote ${RESUME_FILENAME}.pdf and .md to public/`);
