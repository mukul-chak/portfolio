/**
 * Captions for the hover preview panel, keyed by organisation. Shared by
 * the bio's inline links and the resume's titles, so an org reads the same
 * wherever it's hovered.
 *
 * The panel clamps captions to three lines (~278px wide at 1512, 14px
 * Monument), so each is one short sentence about what the place is —
 * except notes (PREVIEW_NOTES), margin notes whose text is never clamped
 * and which show an image only when given one.
 */
export const PREVIEW_CAPTIONS = {
  ascend: "Ascend automates accounting, payments and premium financing for insurance businesses.",
  saag: "South Asian Avant-Garde: a digital magazine on South Asian politics and culture.",
  fidelity: "Fidelity’s internal startup studio, building new ventures from zero to one.",
  bd: "One of the largest medical technology companies in the world.",
  massart: "Massachusetts College of Art and Design, a public art school in Boston.",
  bu: "Boston University, a private research university in Boston.",
  risd: "One of the oldest art and design schools in the US, in Providence.",
  rvce: "An engineering and architecture college in Bangalore, India.",
  // On "trust" in the bio's first sentence. Desktop only: it isn't in the
  // bio's text, so phone and touch visitors don't see it.
  trust:
    "What I’ve learned is that trust is largely a matter of restraint, of knowing how much of the machinery to show and how much to absorb, so that a product does exactly enough and nothing that would give anyone a reason to doubt it.",
} as const;

export type PreviewKey = keyof typeof PREVIEW_CAPTIONS;

/** Keys shown as margin notes: the panel without its image or line clamp. */
export const PREVIEW_NOTES: ReadonlySet<PreviewKey> = new Set<PreviewKey>(["trust"]);

/**
 * A video for the panel's image slot, by key; anything without one keeps
 * the placeholder. Exported at 640×400 (the slot's 1.6:1, 2.3× its ~278px
 * width), H.264 with no audio, looping. Shared keys show it everywhere the
 * org is hovered — Ascend's plays in the bio and on the resume.
 */
export const PREVIEW_VIDEOS: Partial<Record<PreviewKey, string>> = {
  ascend: "/previews/Ascend-Y-Rotation.mp4",
};

/**
 * A still image for the panel's image slot, by key — same 1.6:1 slot and
 * 640×400 export as the videos. A note with one leads with it; it keeps
 * its full, unclamped text below. `caption` and `credit` set under the
 * image, as a figure's are.
 */
export const PREVIEW_IMAGES: Partial<
  Record<PreviewKey, { src: string; caption?: string; credit?: string }>
> = {
  trust: {
    src: "/previews/centre-pompidou-external-services.jpg",
    // One line at 1512 (264 of 278px): the building, its architects and
    // the credit, set like a gallery label. "Piano & Rogers" is
    // non-breaking, so on narrower panels it wraps as a unit. RSHP is
    // Rogers Stirk Harbour + Partners, who supplied the photo.
    caption: "Centre Pompidou, Piano\u00a0&\u00a0Rogers.",
    credit: "Photo: RSHP.",
  },
};

/** A source line under the caption, set like a citation's URL. */
export const PREVIEW_SITES: Partial<Record<PreviewKey, string>> = {
  ascend: "www.useascend.com",
};
