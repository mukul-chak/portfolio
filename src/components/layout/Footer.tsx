import { EMAIL, LOCATION } from "@/content/site";
import LocationTime from "@/components/ui/LocationTime";

/** Placeholder destinations, as in the Contact section. */
const SOCIALS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "Are.na", href: "#" },
];

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
export default function Footer({ tz }: { tz?: string }) {
  return (
    <footer className="bg-bg-weak-25">
      <div className="mx-auto max-w-frame px-5 sm:px-8 xl:px-0">
        {/* Four columns only from md. At 375px they'd be 84px each, which
            squeezed the colophon into a 68px measure 410px tall. Stacked
            below sm, two up at sm. The 16px column padding applies at every
            width, matching the accordion bars' inset from the rules; with
            no column gap, two padded columns at sm still sit 32px apart. */}
        <div className="relative grid grid-cols-1 gap-y-8 pt-12 pb-10 text-[14px] leading-[1.5] text-text-sub-600 sm:grid-cols-2 md:grid-cols-4 md:gap-y-0">
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 hidden w-px rule-x md:block"
              style={{ left: `${pct}%` }}
            />
          ))}

          {/* Every column carries the same 16px on both sides, including
              the outer two — so the first column's text and the last
              column's measure sit the same distance inside the frame's
              own rules rather than on them. */}
          <div className="px-4">
            <p className="text-text-strong-950">Mukul Chakravarthi</p>
            <p>{LOCATION}</p>
            <p>{EMAIL}</p>
          </div>

          <div className="px-4">
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

          <div className="px-4">
            <p>
              Set in Reform Grotesk and Monument by Forgotten Shapes. Built with
              Next.js and Tailwind on AlignUI, deployed on Vercel.
            </p>
          </div>

          <figure className="px-4">
            <blockquote>
              <p>Order itself is charismatic.</p>
            </blockquote>
            <figcaption className="text-text-soft-400">
              — Saul Bellow, <cite>Ravelstein</cite>
            </figcaption>
          </figure>

          {/* Mobile only: below md the header has no room for its clock, so
              the footer carries the date and time, with seconds ticking, in
              the visitor's zone. Set as footer text rather than the header's
              Monument capitals: Reform at the footer's 14/1.5, sentence
              case, left-aligned to the column. */}
          <div className="px-4 md:hidden">
            <LocationTime
              tz={tz}
              seconds
              className="text-left font-sans text-[14px] leading-[1.5] normal-case tracking-normal"
            />
          </div>
        </div>

        <div className="rule-t" />
      </div>
      {/* Below md the theme toggle is a horizontal bar fixed 24px off the
          bottom, 48px tall, so it lands on this band at full scroll. 96px
          = 24 + 48 + 24 clears it with the same 24px gap above as below.
          From md it stands vertically outside the frame. */}
      <div className="h-24 md:h-6" />
    </footer>
  );
}
