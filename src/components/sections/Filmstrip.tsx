"use client";

import { useDragScroll } from "@/lib/useDragScroll";

/**
 * Horizontal image filmstrip. A plain overflow-x container (no scrollbar) clips
 * cards at its right edge, inset 12px from the outer rules. Mouse drag-to-pan
 * via useDragScroll; touch/trackpad scroll natively. Up to 6 cards.
 */
export default function Filmstrip({ count = 6 }: { count?: number }) {
  const drag = useDragScroll<HTMLDivElement>();
  const cards = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="px-3 pt-4">
      <div
        ref={drag.ref}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onPointerCancel={drag.onPointerCancel}
        onClickCapture={drag.onClickCapture}
        className="cursor-grab select-none overflow-x-auto active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-4">
          {cards.map((n) => (
            <div
              key={n}
              className="flex aspect-[1.6] w-[300px] shrink-0 items-center justify-center rounded-xl bg-card text-2xl text-muted sm:w-[504px]"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
