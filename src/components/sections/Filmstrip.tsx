"use client";

import { useDragScroll } from "@/lib/useDragScroll";

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
          data-rule-divider so RecentWork's junction button/connector
          strokes (first project only) can measure its real position at
          runtime instead of a hardcoded offset. */}
      <div data-rule-divider className="border-b border-rule" />
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
              <div className="mt-2 flex items-baseline gap-6 overflow-hidden whitespace-nowrap font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] text-left text-text-sub-600">
                <span className="shrink-0 tabular-nums">{String(n).padStart(2, "0")}</span>
                <span className="truncate">{captions?.[n - 1]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Solid divider between projects, 8px below the captions (not the
          dotted rule). data-rule-divider-close lets the NEXT project's
          RailCarouselConnector reach backward and bridge its own rule-x
          up to this line, closing the gap from below. */}
      <div data-rule-divider-close className="mt-2 border-b border-rule" />
    </div>
  );
}
