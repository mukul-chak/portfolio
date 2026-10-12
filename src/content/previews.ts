/**
 * Captions for the hover preview panel, keyed by organisation. Shared by
 * the bio's inline links and the resume's titles, so an org reads the same
 * wherever it's hovered.
 *
 * The panel clamps captions to three lines (~200px wide at 1512, 14px
 * Monument), so each is one short sentence about what the place is.
 */
export const PREVIEW_CAPTIONS = {
  ascend:
    "Ascend is a Financial Operations and Accounting Platform transforming how money moves in insurance.",
  saag: "South Asian Avant-Garde: a digital magazine on South Asian politics and culture.",
  fidelity: "One of the largest financial services firms in the US.",
  risd: "One of the oldest art and design schools in the US, in Providence.",
  rvce: "An engineering and architecture college in Bangalore, India.",
} as const;

export type PreviewKey = keyof typeof PREVIEW_CAPTIONS;
