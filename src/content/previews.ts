/**
 * Captions for the hover preview panel, keyed by organisation. Shared by
 * the bio's inline links and the resume's titles, so an org reads the same
 * wherever it's hovered.
 *
 * The panel clamps captions to three lines (~200px wide at 1512, 14px
 * Monument), so each is one short sentence about what the place is —
 * except notes (PREVIEW_NOTES), which are text-only margin notes: no image,
 * no clamp.
 */
export const PREVIEW_CAPTIONS = {
  ascend:
    "Ascend is a Financial Operations and Accounting Platform transforming how money moves in insurance.",
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
