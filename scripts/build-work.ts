/**
 * Builds the Work carousels' media. Drop files into work-src/<slug>/,
 * numbered in carousel order (01.mp4, 02_Detail.png, 03.jpg…; subfolders
 * are ignored), and this writes
 * public/work/<slug>/:
 *
 * - Videos (.mp4/.mov/.m4v/.webm/.gif) become a silent 1008×630 H.264 MP4
 *   (the card's 1.6:1 at 2×, cropped from the centre), fast-start. One
 *   already in that shape is copied rather than re-encoded.
 * - Images (.png/.jpg/.jpeg/.webp) become a WebP at most 1512px wide (3×
 *   the card), quality 85; the card crops them to 1.6:1 itself.
 *
 * Runs before `next dev` and `next build` (see package.json). The manifest
 * it writes, src/content/work-media.json, is what the carousels read, and
 * records a hash per source so nothing is rebuilt unless it changed.
 * work-src/ isn't committed (raw recordings are large); outputs and the
 * manifest are, so where there's no work-src/ (a fresh checkout, Vercel)
 * this leaves everything as it is.
 */
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, readdir, writeFile, rm, access, mkdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { projects } from "@/content/projects";
import type { WorkMedia } from "@/content/workMedia";

const run = promisify(execFile);
const root = process.cwd();
const SRC = path.join(root, "work-src");
const OUT = path.join(root, "public", "work");
const MANIFEST = path.join(root, "src", "content", "work-media.json");
// The leading number is the position; anything after it ("02_Detail.png")
// is just a name for you.
const VIDEO = /^(\d+)(?:[_\- ][^/]*)?\.(mp4|mov|m4v|webm|gif)$/i;
const IMAGE = /^(\d+)(?:[_\- ][^/]*)?\.(png|jpe?g|webp)$/i;

type Manifest = Record<string, WorkMedia[]>;

const exists = (p: string) => access(p).then(() => true, () => false);

if (!(await exists(SRC))) {
  console.log("work: no work-src/, nothing to build");
  process.exit(0);
}

const previous: Manifest = (await exists(MANIFEST))
  ? JSON.parse(await readFile(MANIFEST, "utf8"))
  : {};
const next: Manifest = {};
const slugs = new Set(projects.map((p) => p.slug));
let built = 0;

async function ffmpegPath() {
  // Loaded only when there's a video to encode.
  const { default: bin } = await import("ffmpeg-static");
  if (!bin) throw new Error("work: ffmpeg-static has no binary for this platform");
  return bin as unknown as string;
}

for (const slug of (await readdir(SRC)).sort()) {
  if (slug.startsWith(".")) continue;
  if (!slugs.has(slug)) {
    console.warn(`work: skipping work-src/${slug}/, no project has that slug`);
    continue;
  }
  const items: WorkMedia[] = [];
  for (const file of (await readdir(path.join(SRC, slug))).sort()) {
    const video = VIDEO.exec(file);
    const image = IMAGE.exec(file);
    if (!video && !image) continue;
    const n = (video ?? image)![1].padStart(2, "0");
    const ext = video ? "mp4" : "webp";
    const input = path.join(SRC, slug, file);
    const outName = `${n}.${ext}`;
    if (items.some((m) => path.basename(m.src).startsWith(`${n}.`))) {
      console.warn(`work: skipping ${slug}/${file}, position ${n} is already taken`);
      continue;
    }
    const out = path.join(OUT, slug, outName);
    const hash = createHash("sha256").update(await readFile(input)).digest("hex");
    items.push({ src: `/work/${slug}/${outName}`, kind: video ? "video" : "image", source: file, hash });

    const before = previous[slug]?.find((m) => m.source === file);
    if (before?.hash === hash && (await exists(out))) continue;
    await mkdir(path.dirname(out), { recursive: true });

    const ffmpeg = await ffmpegPath();
    if (image) {
      await run(ffmpeg, [
        "-hide_banner", "-loglevel", "error", "-y",
        "-i", input,
        "-vf", "scale='min(1512,iw)':-2",
        "-c:v", "libwebp", "-quality", "85", "-compression_level", "6",
        out,
      ]);
    } else {
      const info = await run(ffmpeg, ["-hide_banner", "-i", input]).then(
        (r) => r.stderr,
        (e: { stderr?: string }) => e.stderr ?? "",
      );
      const ready = /Video: h264.*\b1008x630\b/.test(info) && !/Audio:/.test(info);
      await run(ffmpeg, [
        "-hide_banner", "-loglevel", "error", "-y",
        "-i", input,
        ...(ready
          ? ["-c:v", "copy"]
          : [
              "-vf", "scale=1008:630:force_original_aspect_ratio=increase,crop=1008:630",
              "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p",
            ]),
        "-an", "-movflags", "+faststart",
        out,
      ]);
    }
    built++;
    console.log(`work: ${slug}/${file} → public/work/${slug}/${outName}`);
  }
  if (items.length) next[slug] = items;
}

// Outputs whose source is gone go with it.
for (const [slug, items] of Object.entries(previous)) {
  for (const item of items) {
    if (!next[slug]?.some((m) => m.src === item.src)) {
      await rm(path.join(root, "public", item.src), { force: true });
    }
  }
}

const json = `${JSON.stringify(next, null, 2)}\n`;
if (json !== JSON.stringify(previous, null, 2) + "\n") await writeFile(MANIFEST, json);
const total = Object.values(next).reduce((n, items) => n + items.length, 0);
console.log(`work: ${total} file(s), ${built} built`);
