import { type ReactNode } from "react";
import ScrollFade from "@/components/layout/ScrollFade";
import TopScrim from "@/components/layout/TopScrim";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Page frame: a centered max-width container. The rules are no longer drawn
 * here — the Header owns its own short outer strokes, and the content frame
 * (see page) owns the outer + inner rules that start below the nav divider.
 */
export default function Frame({ children }: { children: ReactNode }) {
  return (
    // No min-h-screen. It filled the viewport back when the page ended
    // here, but with a footer below it pads this container to the full
    // height on a short page — and that filler lands between the last
    // ruled gap and the footer, so the column verticals stopped short of
    // the band with blank space under them. The footer is the page's
    // bottom now, so the height comes from the content.
    <div className="relative mx-auto max-w-frame px-5 sm:px-8 xl:px-0">
      {/* Anchor for Bio's hover-preview portal. */}
      <div id="bio-preview-anchor" className="relative" />
      {/* Spotlight scrim: a translucent layer over the whole page, shown only
          while the preview portal has content (see the preview-scrim rule).
          Dims everything beneath it; the preview panel and the hovered link
          itself both render above it (z-[45]+) so they stay fully bright —
          a wrapper's own opacity can't be "undone" by a child's, so dimming
          has to work this way round instead. */}
      <div
        aria-hidden
        className="preview-scrim pointer-events-none fixed inset-0 z-40 bg-background opacity-0 transition-opacity duration-200 ease-[var(--ease-out)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background from-30% to-transparent"
      />
      <TopScrim />
      {/* z-[16]: above the narrow rule-x column verticals (z-[15]) so this
          fade actually covers them, per "narrower verticals should fall
          under the bottom scroll fade" — but below the wide outer frame
          rule (bumped to z-[17] in page.tsx), which stays crisp/unaffected,
          out of scope for that request. */}
      <ScrollFade />
      {/* Horizontal on mobile, vertical from md.
          The 24px offsets stay in classes and the safe area is added as
          margin on top, rather than folded into a calc() for `bottom`.
          That would tie the two together: if the env() failed to parse,
          the whole declaration drops and the control loses its offsets
          altogether instead of just its inset clearance — a fixed element
          with no bottom/right falls back to its static position, which
          here is off up the page.

          From md it stands in the right gutter, 24px off the window's
          edge — but the gutter is only wide enough for that from 1392px
          (24 + the 36px pill + 16px clear of the frame's outer rule, each
          side of the 1240px frame). Narrower, it sat on the rule. There it
          moves inside the frame instead, 16px in from the rule, into the
          right channel: below xl the rule is the frame's 32px padding in
          (48px), from xl to 1392 it's half of what the frame leaves
          ((100% − 1240px) / 2 + 16px; % of the viewport, which a fixed
          box's containing block is, so a classic scrollbar can't skew it).
          Each override is a closed range, so the plain right-6 is what
          applies from 1392 up — open-ended variants left the order of the
          xl and arbitrary breakpoints to Tailwind's sort, and xl won.
          Mobile keeps its 24px horizontal bar. */}
      <div
        className="fixed bottom-6 right-6 z-20 md:max-xl:right-12 xl:max-[1391px]:right-[calc((100%-1240px)/2+16px)]"
        style={{
          marginBottom: "env(safe-area-inset-bottom, 0px)",
          marginRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <ThemeToggle orientation="responsive" />
      </div>
      {children}
    </div>
  );
}
