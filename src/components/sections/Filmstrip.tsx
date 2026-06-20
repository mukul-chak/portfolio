"use client";

import { ScrollArea } from "@base-ui/react/scroll-area";
import { useDragScroll } from "@/lib/useDragScroll";

/**
 * Horizontal image filmstrip. The viewport is inset 12px from the outer rules
 * (px-3) and clips overflowing cards at its right edge — that crop is the
 * "line stroke" cropping the strip. Built on Base UI ScrollArea; mouse-drag is
 * added in chunk 6. Up to 6 cards.
 */

export default function Filmstrip({ count = 6 }: { count?: number }) {
  const drag = useDragScroll<HTMLDivElement>();
  const cards = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="px-3 pt-4">
      <ScrollArea.Root>
        <ScrollArea.Viewport
          ref={drag.ref}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerCancel}
          onClickCapture={drag.onClickCapture}
          className="cursor-grab select-none overflow-x-auto active:cursor-grabbing"
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
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="horizontal"
          className="mt-2 flex h-1.5 touch-none select-none justify-center rounded-full bg-rule/60 opacity-0 transition-opacity data-[hovering]:opacity-100 data-[scrolling]:opacity-100"
        >
          <ScrollArea.Thumb className="h-full rounded-full bg-muted" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
