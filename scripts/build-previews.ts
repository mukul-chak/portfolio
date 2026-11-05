/**
 * Encodes the hover notes' moving previews. Drop a source file into
 * previews-src/ named after its preview key (saag.gif, fidelity.mov,
 * ascend.mp4…) and this writes public/previews/<key>.mp4: 640×400 (the
 * slot's 1.6:1, cropped from the centre), H.264, no audio, fast-start, so
 * every clip loops the same way whatever it started as. A source already
 * in that shape is copied rather than re-encoded.
 *
 * Runs before `next dev` and `next build` (see package.json). The manifest
 * it writes, src/content/preview-videos.json, is what the site reads to
 * know which keys have a video, and records a hash of each source, so a
 * clip is only re-encoded when its source changes. Outputs and manifest
 * are committed, so a fresh checkout (or Vercel) has nothing to encode.
 */
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, readdir, writeFile, rm, access } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { PREVIEW_CAPTIONS } from "@/content/previews";

const run = promisify(execFile);
const root = process.cwd();
const SRC = path.join(root, "previews-src");
const OUT = path.join(root, "public", "previews");
const MANIFEST = path.join(root, "src", "content", "preview-videos.json");
const SOURCE = /^([a-z0-9-]+)\.(gif|mov|mp4|m4v|webm)$/i;

type Manifest = Record<string, { source: string; hash: string }>;

const exists = (p: string) => access(p).then(() => true, () => false);

const previous: Manifest = (await exists(MANIFEST))
  ? JSON.parse(await readFile(MANIFEST, "utf8"))
  : {};
const next: Manifest = {};
let encoded = 0;

for (const file of (await readdir(SRC)).sort()) {
  const match = SOURCE.exec(file);
  if (!match) continue;
  const key = match[1].toLowerCase();
  if (!(key in PREVIEW_CAPTIONS)) {
    console.warn(`previews: skipping ${file}, "${key}" isn't a preview key`);
    continue;
  }
  if (next[key]) {
    console.warn(`previews: skipping ${file}, "${key}" already has ${next[key].source}`);
    continue;
  }

  const hash = createHash("sha256").update(await readFile(path.join(SRC, file))).digest("hex");
  const out = path.join(OUT, `${key}.mp4`);
  next[key] = { source: file, hash };
  if (previous[key]?.hash === hash && (await exists(out))) continue;

  // Loaded only when there's something to encode, so a checkout with
  // up-to-date outputs never needs the binary.
  const { default: bin } = await import("ffmpeg-static");
  if (!bin) throw new Error("previews: ffmpeg-static has no binary for this platform");
  const ffmpeg = bin as unknown as string;
  const input = path.join(SRC, file);

  // A source that's already a silent 640×400 H.264 clip is copied as-is
  // (only re-muxed for fast start): re-encoding it would only cost
  // quality, and soften textures like the Ascend clip's grain.
  const info = await run(ffmpeg, ["-hide_banner", "-i", input]).then(
    (r) => r.stderr,
    (e: { stderr?: string }) => e.stderr ?? "",
  );
  const ready = /Video: h264.*\b640x400\b/.test(info) && !/Audio:/.test(info);

  await run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", input,
    ...(ready
      ? ["-c:v", "copy"]
      : [
          "-vf", "scale=640:400:force_original_aspect_ratio=increase,crop=640:400",
          "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
        ]),
    "-an", "-movflags", "+faststart",
    out,
  ]);
  encoded++;
  console.log(`previews: ${file} → public/previews/${key}.mp4${ready ? " (copied)" : ""}`);
}

// A source that's gone takes its encode with it.
for (const key of Object.keys(previous)) {
  if (!next[key]) await rm(path.join(OUT, `${key}.mp4`), { force: true });
}

const json = `${JSON.stringify(next, null, 2)}\n`;
if (json !== JSON.stringify(previous, null, 2) + "\n") await writeFile(MANIFEST, json);
console.log(`previews: ${Object.keys(next).length} video(s), ${encoded} encoded`);
