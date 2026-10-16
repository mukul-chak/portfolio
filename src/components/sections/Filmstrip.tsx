"use client";

import { useDragScroll } from "@/lib/useDragScroll";

/**
 * A divider across the frame. No plus marks: junctions inside an accordion's
 * content aren't marked, only the header's and the accordion bars'.
 *
 * -mx-4 cancels Filmstrip's own padding so the line reaches the outer frame
 * rule instead of stopping 16px short of it on each side — the cards are what
 * the padding is for, not the rules.
 */
function Divider({
  className = "",
  ...rest
}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative -mx-4 ${className}`} {...rest}>
      <div className="border-b border-rule" />
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
}: {
  count?: number;
  captions?: string[];
}) {
  const drag = useDragScroll<HTMLDivElement>();
  const cards = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="px-4 pt-1">
      {/* Solid divider above the carousel, 8px above the images. Carries
          data-rule-divider so RecentWork's junction connector strokes can
          measure its real position at runtime instead of a hardcoded offset. */}
      <Divider data-rule-divider />
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
      {/* Solid divider between projects (not the dotted rule), splitting
          the space between the captions and the next title optically: 39px
          here and 41px to the next title's box (RecentWork) put the line
          43.5px below the captions' baseline and 43.9px above the title's
          cap height — the caption's baseline sits 4.5px inside its box, the
          title's caps 2.9px. data-rule-divider-close lets the NEXT project's
          connector reach backward and bridge its own rule-x up to this line,
          closing the gap from below. */}
      <Divider data-rule-divider-close className="mt-[39px]" />
    </div>
  );
}
