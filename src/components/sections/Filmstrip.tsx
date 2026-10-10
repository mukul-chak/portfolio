"use client";

import { useDragScroll } from "@/lib/useDragScroll";
import RuleJunction from "@/components/ui/RuleJunction";

/**
 * A divider and the plus marks for every vertical rule that crosses it.
 *
 * -mx-4 cancels Filmstrip's own padding so the line reaches the outer frame
 * rule instead of stopping 16px short of it on each side — the cards are what
 * the padding is for, not the rules.
 *
 * The outer rule is pinned to the viewport at z-[17] and is deliberately
 * exempt from the bottom scroll fade (z-[16]), so its junctions sit at z-[18]
 * and stay exempt with it. The narrow column rules are z-[15] and do fade, so
 * their junctions match them. A junction follows the rule it marks.
 */
function Divider({
  narrow,
  className = "",
  ...rest
}: {
  /** Whether the column rules reach this line — the last project's closing
   *  divider has nothing below it, so they don't. */
  narrow: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative -mx-4 ${className}`} {...rest}>
      <div className="border-b border-rule" />
      <RuleJunction className="left-[0.5px] top-[0.5px] z-[18] -translate-x-1/2 -translate-y-1/2" />
      <RuleJunction className="right-[0.5px] top-[0.5px] z-[18] translate-x-1/2 -translate-y-1/2" />
      {narrow && (
        // An overlay box the width of the column, so the two column rules can
        // be addressed as its own edges — same mx-auto max-w-column centring
        // that places the rules themselves, so the x-positions agree by
        // construction rather than by a measured offset.
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="relative mx-auto h-full max-w-column">
            <RuleJunction className="pointer-events-auto left-[0.5px] top-[0.5px] z-[15] -translate-x-1/2 -translate-y-1/2" />
            <RuleJunction className="pointer-events-auto right-[0.5px] top-[0.5px] z-[15] translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Horizontal image filmstrip. A plain overflow-x container (no scrollbar) clips
 * cards at its right edge, inset 16px from the outer rules. Mouse drag-to-pan
 * via useDragScroll; touch/trackpad scroll natively. Up to 6 cards.
 *
 * Each card carries a single-line caption below it (index + text, truncated),
 * so caption and image travel together through the horizontal scroll.
 */
export default function Filmstrip({
  count = 6,
  captions,
  last = false,
}: {
  count?: number;
  captions?: string[];
  /** Last project on the page: no rail follows, so the closing divider has no
   *  column rules crossing it. */
  last?: boolean;
}) {
  const drag = useDragScroll<HTMLDivElement>();
  const cards = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="px-4 pt-1">
      {/* Solid divider above the carousel, 8px above the images. Carries
          data-rule-divider so RecentWork's junction connector strokes can
          measure its real position at runtime instead of a hardcoded offset. */}
      <Divider data-rule-divider narrow />
      <div
        data-carousel-row
        ref={drag.ref}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onPointerCancel={drag.onPointerCancel}
        onClickCapture={drag.onClickCapture}
        className="mt-3 cursor-grab select-none overflow-x-auto active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-4">
          {cards.map((n) => (
            <div key={n} className="w-[300px] shrink-0 sm:w-[504px]">
              <div className="aspect-[1.6] rounded-[4px] bg-card" />
              <div className="mt-2 flex items-baseline gap-6 overflow-hidden whitespace-nowrap font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] text-left text-text-soft-400">
                <span className="shrink-0 tabular-nums">{String(n).padStart(2, "0")}</span>
                <span className="truncate">{captions?.[n - 1]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Solid divider between projects, 8px below the captions (not the
          dotted rule). data-rule-divider-close lets the NEXT project's
          connector reach backward and bridge its own rule-x up to this line,
          closing the gap from below. */}
      <Divider data-rule-divider-close narrow={!last} className="mt-2" />
    </div>
  );
}
