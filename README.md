# mukul.work

Mukul Chakravarthi's portfolio. Next.js 15 (App Router), React 18, Tailwind v4 on AlignUI tokens.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

`npm run dev` and `npm run build` first run the three build steps below, so generated files always match their sources. Don't run `npm run build` while the dev server is up: both write to `.next/`.

```bash
npm run lint    # ESLint, then the copy check
npx tsc --noEmit
```

## Editing copy

Every word on the site lives in [`src/content/copy.md`](src/content/copy.md). The site reads it directly: edit it and the page, the PDF resume and the Markdown resume all change. Its conventions are at the top of the file.

`npm run lint` fails if copy.md has a missing, misspelled or unused entry, or if a component carries copy of its own instead of reading it from copy.md.

## Media

| What | Drop sources in | Built into | By |
| --- | --- | --- | --- |
| Work carousels | `work-src/<project-slug>/` | `public/work/` + `src/content/work-media.json` | `npm run work` |
| Hover-preview videos | `previews-src/<org-key>.{gif,mov,mp4}` | `public/previews/` + `src/content/preview-videos.json` | `npm run previews` |
| Resume PDF + Markdown | (copy.md) | `public/Mukul-Chakravarthi-Resume.*` | `npm run resume` |

`work-src/` holds raw recordings and is not committed. Hover-preview stills are listed in `src/content/previews.ts`.

Everything else raw or archived (renders, full-size stills, old avatar videos, project sources) lives outside the repo, in `~/Documents/01_Design/Portfolio`. The repo keeps only what the site or its build steps read.

## Layout

```
src/
  app/            layout, page, global styles and tokens
  components/
    layout/       frame, header, footer, rails, scrims
    sections/     the page's sections: bio, work carousels, experience and teaching
    drawers/      About and Write to me
    ui/           shared primitives (buttons, accordion, hover preview, …)
  content/        copy.md and the modules that read it; media manifests
  lib/            hooks and helpers; the resume PDF and Markdown builders
scripts/          build steps, the copy check, and the .md loaders
```

## Deploy

Manual, from `main`:

```bash
npx vercel deploy --prod
```
