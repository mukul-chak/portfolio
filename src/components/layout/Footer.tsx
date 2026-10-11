import { EMAIL } from "@/content/site";

/** Placeholder destinations, as in the Contact section. */
const SOCIALS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "Are.na", href: "#" },
];

const REPO = "https://github.com/mukul-chak/portfolio";

/**
 * Closing footer: four equal columns across the frame.
 *
 * The tint runs the full window width while the content sits on the frame
 * grid, so the band reads as closing the page rather than as one more block
 * inside it. That's why this renders outside Frame — Frame caps its children
 * at the frame width, and a full-bleed child of it would need negative
 * margins fighting that cap.
 *
 * The three separators are placed at 25/50/75% of the frame rather than at
 * measured pixels. The frame is 1240 and the column rules above sit at 446
 * and 1066, which are exactly its quarter and three-quarter marks — so four
 * equal columns put two separators on those rules and the third on their
 * midpoint, by construction rather than by coincidence.
 */
export default function Footer() {
  return (
    <footer className="bg-bg-weak-25">
      <div className="mx-auto max-w-frame px-5 sm:px-8 xl:px-0">
        {/* Four columns only from md. At 375px they'd be 84px each, which
            squeezed the colophon into a 68px measure 410px tall. Stacked
            below sm, two up at sm, and the column padding only applies
            where the separators do — stacked blocks sit flush to the
            content edge instead. */}
        <div className="relative grid grid-cols-1 gap-y-8 pt-12 pb-10 text-[13px] leading-[1.5] text-text-sub-600 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-4 md:gap-x-0 md:gap-y-0">
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 hidden w-px rule-x md:block"
              style={{ left: `${pct}%` }}
            />
          ))}

          {/* No left padding: the name sits on the outer rule itself. The
              last column drops its right padding for the same reason, so
              both outer edges of the footer land on the frame's own lines. */}
          <div className="md:pr-4">
            <p className="text-text-strong-950">Mukul Chakravarthi</p>
            <p>San Francisco, CA</p>
            <p>{EMAIL}</p>
          </div>

          <div className="md:px-4">
            {SOCIALS.map((s) => (
              <p key={s.label}>
                <a
                  href={s.href}
                  className="underline decoration-rule decoration-1 underline-offset-[3px] transition-colors duration-100 ease-out hover:text-text-strong-950 hover:decoration-text-strong-950"
                >
                  {s.label}
                </a>
              </p>
            ))}
          </div>

          <div className="md:px-4">
            <p>
              Set in Reform Grotesk and Monument by Forgotten Shapes. Built with
              Next.js and Tailwind on AlignUI, deployed on Vercel.{" "}
              <a
                href={REPO}
                className="underline decoration-rule decoration-1 underline-offset-[3px] transition-colors duration-100 ease-out hover:text-text-strong-950 hover:decoration-text-strong-950"
              >
                Source on GitHub
              </a>
              .
            </p>
          </div>

          <div className="md:pl-4">
            <p>
              The internet is a vast space with eons of interesting content. I’m
              grateful you chose to spend some of yours here.
            </p>
          </div>
        </div>

        <div className="rule-t" />
      </div>
      <div className="h-6" />
    </footer>
  );
}
