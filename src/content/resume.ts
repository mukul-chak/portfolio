/**
 * Resume content for the About section.
 *
 * SOURCING — read before editing.
 *
 * LinkedIn is behind a login wall, so the history here could not be read
 * directly. What it did surface publicly: RISD, an Ascend post calling Mukul
 * "our first full-time designer", a July 2025 article opening "In June 2024,
 * I left Fidelity", and sixteen experience entries whose titles and dates
 * were not visible.
 *
 * Everything marked `needsConfirming` is inference, not fact. Roles earlier
 * than Fidelity are deliberately absent rather than invented — a fabricated
 * history in a document written for recruiters is worse than a short one.
 *
 * Ascend's product surface and customer numbers are from useascend.com and
 * are the company's own published figures, framed as context rather than as
 * personal attribution.
 */

export type Role = {
  org: string;
  title: string;
  /** Rendered as given, e.g. "2024 — Present". */
  dates: string;
  /** One line on what the place is, for a reader who doesn't know it. */
  context?: string;
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
    title: "Head of Design",
    dates: "2024 — Present",
    context:
      "The financial operations platform for insurance — used by 4,000+ insurance businesses, including more than half of the 50 largest brokers.",
    points: [
      "First design hire. Built the practice, the system and the patterns the platform now runs on.",
      "Own design across the financial stack: billing and invoicing, premium financing, cash application, carrier payables and direct bill automation.",
      "Shaped the house approach to applied AI — models read the documents, people keep the judgment — so automation earns trust in a domain that audits everything.",
      "Partner with founders and engineering on what gets built and in what order, not only on how it looks.",
    ],
  },
  {
    org: "SAAG",
    title: "Design Director & Advisor",
    // Concurrent with Ascend, so it sits directly below it rather than in
    // date order — a reader scanning the left edge should see both current
    // roles together.
    dates: "Present · Advisory",
    points: [
      "Advise on product strategy and shape next-generation product experiences.",
    ],
    needsConfirming: true,
  },
  {
    org: "Fidelity Investments",
    title: "Product Design",
    dates: "Until 2024",
    context: "Consumer and institutional financial products at scale.",
    points: [
      "Designed inside one of the largest financial institutions in the US, where regulation and scale set the constraints.",
    ],
    needsConfirming: true,
  },
];

export const education = {
  org: "Rhode Island School of Design",
  detail: "Degree and years to confirm.",
  needsConfirming: true,
};

/**
 * Capability tags. Chosen as the terms that actually appear in staff and
 * design-manager postings at AI-first companies, so a keyword scan catches
 * them — but kept to things the work above genuinely evidences.
 */
export const capabilities = [
  "Design leadership",
  "0→1 product",
  "Design systems",
  "Applied AI / human-in-the-loop",
  "Complex workflow design",
  "Fintech & insurance",
  "Prototyping",
  "Art direction",
];
