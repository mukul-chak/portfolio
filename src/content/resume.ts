/**
 * Resume content for the Experience section.
 *
 * SOURCING — read before editing.
 *
 * LinkedIn is behind a login wall, so the history here could not be read
 * directly. What it did surface publicly: RISD, an Ascend post calling Mukul
 * "our first full-time designer", a July 2025 article opening "In June 2024,
 * I left Fidelity", and sixteen experience entries whose titles and dates
 * were not visible.
 *
 * Confirmed by Mukul (Oct 2026): Ascend title and bullets; Fidelity dates
 * (Feb 2021 – May 2024); SAAG's history; both degrees and their years; the
 * 10,000+ statements figure; six years in product design, starting at BD in
 * June 2020.
 *
 * Everything still marked `needsConfirming` is inference, not fact. BD is
 * deliberately absent until its title is known — a fabricated history in a
 * document written for recruiters is worse than a short one.
 *
 * Ascend's product surface is from useascend.com. Its customer numbers
 * (4,000+ businesses, more than half the 50 largest brokers, 10,000+
 * statements a month) went out with the per-role context line, which the
 * hover preview replaced; its captions are short enough to fit three lines.
 */

import type { PreviewKey } from "@/content/previews";

export type Role = {
  org: string;
  title: string;
  /** Rendered as given, e.g. "2024–Present" — an unspaced en dash. */
  dates: string;
  /** Keys the org's hover preview caption (content/previews.ts). */
  id: PreviewKey;
  href: string;
  /** Kept to four at most; each should land on its own. */
  points: string[];
  /** True where the dates or title are inferred rather than known. */
  needsConfirming?: boolean;
};

/**
 * Positioning line. Written for staff and design-manager screens at
 * AI-first companies: leads with judgment under stakes, names the AI
 * posture, and signals both direction-setting and craft.
 */
export const summary =
  "Design leader working where financial software meets applied AI. I take ambiguous, high-stakes operational problems — the kind with money and an audit trail attached — and turn them into products people trust at scale. A first-principles thinker, equally at home setting direction and in the pixels.";

export const roles: Role[] = [
  {
    org: "Ascend",
    id: "ascend",
    href: "https://www.useascend.com",
    title: "Head of Design",
    dates: "2024–Present",
    points: [
      "First design hire. Built the practice, the system and the patterns the platform now runs on.",
      "Own design across the financial stack: billing and invoicing, premium financing, cash application, carrier payables and direct bill automation.",
      "Shaped the house approach to applied AI — models read the documents, people keep the judgment — so automation earns trust in a domain that audits everything.",
      "Partner with founders and engineering on what gets built and in what order, not only on how it looks.",
    ],
  },
  {
    org: "SAAG",
    id: "saag",
    href: "https://www.saaganthology.com",
    title: "Design Director & Advisor",
    // Concurrent with Ascend, so it sits directly below it rather than in
    // date order — a reader scanning the left edge should see both current
    // roles together.
    dates: "Present · Advisory",
    points: [
      "One of its earliest designers: joined as motion graphics designer for Volume 2, then became design director and advisor from Volume 3.",
    ],
    // Start years per volume still unknown, so dates stay undated.
    needsConfirming: true,
  },
  {
    org: "Fidelity Investments",
    id: "fidelity",
    href: "https://www.fidelity.com",
    title: "Product Design",
    dates: "2021–2024",
    points: [
      "Designed inside one of the largest financial institutions in the US, where regulation and scale set the constraints.",
    ],
    needsConfirming: true,
  },
];

export const education: {
  org: string;
  id: PreviewKey;
  href: string;
  degree: string;
  dates: string;
}[] = [
  {
    org: "Rhode Island School of Design",
    id: "risd",
    href: "https://www.risd.edu",
    degree: "MFA, Graphic Design",
    dates: "2017–2020",
  },
  {
    org: "R.V. College of Engineering, Bangalore",
    id: "rvce",
    href: "https://rvce.edu.in",
    degree: "B.Arch",
    dates: "2011–2016",
  },
];
