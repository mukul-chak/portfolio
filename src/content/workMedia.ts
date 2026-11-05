import manifest from "@/content/work-media.json";

/** One file in a project's carousel, in order. Built by scripts/build-work.ts. */
export type WorkMedia = { src: string; kind: "video" | "image"; source: string; hash: string };

/**
 * A project's carousel media by slug; empty for a project without any yet.
 * Each src carries its source's hash, so replacing a file at the same
 * position (02.png) can't be served stale from a cache.
 */
export function workMedia(slug: string): WorkMedia[] {
  return ((manifest as Record<string, WorkMedia[]>)[slug] ?? []).map((m) => ({
    ...m,
    src: `${m.src}?v=${m.hash.slice(0, 8)}`,
  }));
}
