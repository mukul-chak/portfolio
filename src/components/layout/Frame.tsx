import { type ReactNode } from "react";
import TopScrim from "@/components/layout/TopScrim";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Page frame: a centered max-width container. The rules are no longer drawn
 * here — the Header owns its own short outer strokes, and the content frame
 * (see page) owns the outer + inner rules that start below the nav divider.
 */
export default function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-screen max-w-frame px-5 sm:px-8 xl:px-0">
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
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[16] h-32 bg-gradient-to-t from-background from-20% to-transparent"
      />
      <div className="fixed bottom-6 right-6 z-20">
        <ThemeToggle orientation="vertical" />
      </div>
      {children}
    </div>
  );
}
