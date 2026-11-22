import previewVideos from "@/content/preview-videos.json";
import type { OrgKey } from "@/content/copy";

/**
 * Media for the hover preview panel, by organisation. The panel's text —
 * each organisation's note and site line — is copy, in copy.md.
 */
export type PreviewKey = OrgKey;

/** Keys shown as margin notes: the panel without its image or line clamp. */
export const PREVIEW_NOTES: ReadonlySet<PreviewKey> = new Set<PreviewKey>();

/**
 * A video for the panel's image slot, by key; anything without one keeps
 * the placeholder. Built by scripts/build-previews.ts from whatever is in
 * previews-src/ (drop in <key>.gif/.mov/.mp4): 640×400, H.264, no audio,
 * looping. Shared keys show it everywhere the org is hovered — Ascend's
 * plays in the bio and on the resume.
 */
export const PREVIEW_VIDEOS: Partial<Record<PreviewKey, string>> = Object.fromEntries(
  Object.keys(previewVideos).map((key) => [key, `/previews/${key}.mp4`]),
);

/**
 * A still image for the panel's image slot, by key — same 1.6:1 slot and
 * 640×400 export as the videos. `caption` and `credit` set under the image,
 * as a figure's are. 1920×1200 PNG sources are kept in renders/previews/
 * (not committed).
 */
export const PREVIEW_IMAGES: Partial<
  Record<PreviewKey, { src: string; caption?: string; credit?: string }>
> = {
  fidelity: { src: "/previews/fidelity.webp" },
  bd: { src: "/previews/bd.webp" },
};
