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
 * From Mukul's May 2025 resume, confirmed and reframed with him (Oct
 * 2026): Fidelity Labs — Senior, then Principal from 2023; Calico (the Plaid
 * for crypto; he designed its API docs, connection flow and integrations
 * hub), the AI copilot; BD as Interaction Designer, Jun 2020 – Feb
 * 2021, HealthSight Diversion Management; and the teaching roles.
 *
 * Everything still marked `needsConfirming` is inference, not fact — a
 * fabricated history in a document written for recruiters is worse than a
 * short one.
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
 * What Mukul is best at and what the work has taught him, in the bio's
 * voice. The bio already carries the philosophy, the Ascend role and the
 * kind of team he wants, so this stays on strength and lesson only. Kept to
 * four lines in the column at 1512.
 */
export const summary =
  "I do my best work on complex operational software that handles money and carries an audit trail, turning dense, rule-bound workflows into something people can move through quickly and trust. Building a design function from the ground up has taught me that design earns its influence through what it ships.";

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
    org: "Fidelity Labs",
    id: "fidelity",
    href: "https://www.fidelity.com",
    // Promoted from Senior to Principal in 2023.
    title: "Senior, then Principal Product Designer",
    dates: "2021–2024",
    points: [
      "Led product design for Calico from zero to launch: a Fidelity Labs startup building account-aggregation infrastructure for crypto, one API connecting exchanges, wallets and banks for teams building consumer and institutional products.",
      "Designed Calico’s core surfaces: the API docs, the end-user account connection flow, and an integrations hub where people manage the web3 apps linked to their accounts.",
      "Led design of an AI copilot for planning and advice inside Fidelity’s retail trading platform, which serves 30 million+ customers.",
    ],
  },
  {
    org: "Becton Dickinson (BD)",
    id: "bd",
    href: "https://www.bd.com",
    title: "Interaction Designer",
    dates: "2020–2021",
    points: [
      "Led UX for HealthSight Diversion Management, BD’s cloud analytics product that flags likely opioid diversion across hospital systems, designing the workflows clinicians use to triage alerts and see an investigation through.",
    ],
  },
];

export type ListEntry = {
  org: string;
  id: PreviewKey;
  href: string;
  /** The line under the org: a degree, or a role and department. */
  detail: string;
  dates: string;
};

export const education: ListEntry[] = [
  {
    org: "Rhode Island School of Design",
    id: "risd",
    href: "https://www.risd.edu",
    detail: "MFA, Graphic Design",
    dates: "2017–2020",
  },
  {
    org: "R.V. College of Engineering, Bangalore",
    id: "rvce",
    href: "https://rvce.edu.in",
    detail: "B.Arch",
    dates: "2011–2016",
  },
];

// Newest and ongoing first. Dates per the May 2025 resume.
export const teaching: ListEntry[] = [
  {
    org: "MassArt",
    id: "massart",
    href: "https://massart.edu",
    detail: "Guest Lecturer · Communication Design",
    dates: "2021–Present",
  },
  {
    org: "Boston University",
    id: "bu",
    href: "https://www.bu.edu",
    detail: "Guest Critic · Graphic Design",
    dates: "2021–2024",
  },
  {
    org: "Rhode Island School of Design",
    id: "risd",
    href: "https://www.risd.edu",
    detail: "Adjunct Professor · Graphic Design",
    dates: "2021",
  },
];
