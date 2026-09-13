"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as Button from "@/components/ui/Button";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

type Segment = { x: number; top: number; height: number };

type Measurements = {
  rightX: number;
  buttonTop: number | null;
  above: [Segment, Segment]; // [left, right]
  incoming: [Segment, Segment] | null; // [left, right]
};

/**
 * Wraps a Rail + Filmstrip pair and keeps both vertical rules (left and
 * right) genuinely touching every horizontal line around them: this rail's
 * own bottom down to the divider above its carousel, and (every project
 * after the first) the divider closing the PREVIOUS project's carousel up
 * into this rail's own rule-x.
 *
 * A connector only ever bridges the gap BETWEEN two real rule endpoints —
 * it touches one, touches the other, and stops. It never continues past a
 * divider into the carousel's own gap, because there is no rule on the far
 * side to reach (the carousel intentionally has none — "filmstrip breaks
 * the rail"). Optionally also renders a plus button at the rail/divider
 * junction (first project only, by request).
 *
 * All positions are measured at runtime (getBoundingClientRect), not
 * hardcoded — a hardcoded px offset here previously drifted out of sync
 * the moment upstream content height changed.
 */
export default function CarouselJunctionButton({
  children,
  showButton = false,
}: {
  children: ReactNode;
  showButton?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Measurements | null>(null);

  useEffect(() => {
    function measure() {
      const el = ref.current;
      if (!el) return;
      const rule = el.querySelector<HTMLElement>(".rule-x");
      const divider = el.querySelector<HTMLElement>("[data-rule-divider]");
      if (!rule || !divider) return;

      const elRect = el.getBoundingClientRect();
      const ruleRect = rule.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      const dividerCenterY = dividerRect.top + dividerRect.height / 2;

      // rule-x draws its left line at the box's left edge and its right
      // line at the box's right edge — same box, both edges, so one
      // getBoundingClientRect gives both x-coordinates.
      const leftX = ruleRect.left - elRect.left + 0.5;
      const rightX = ruleRect.right - elRect.left - 0.5;

      const aboveTop = ruleRect.bottom - elRect.top;
      const aboveHeight = dividerRect.top - ruleRect.bottom;
      const above: [Segment, Segment] = [
        { x: leftX, top: aboveTop, height: aboveHeight },
        { x: rightX, top: aboveTop, height: aboveHeight },
      ];

      const prevDivider = el.previousElementSibling?.querySelector<HTMLElement>(
        "[data-rule-divider-close]",
      );
      let incoming: [Segment, Segment] | null = null;
      if (prevDivider) {
        const prevRect = prevDivider.getBoundingClientRect();
        const incomingTop = prevRect.bottom - elRect.top;
        const incomingHeight = ruleRect.top - prevRect.bottom;
        incoming = [
          { x: leftX, top: incomingTop, height: incomingHeight },
          { x: rightX, top: incomingTop, height: incomingHeight },
        ];
      }

      setM({
        rightX,
        buttonTop: showButton ? dividerCenterY - elRect.top : null,
        above,
        incoming,
      });
    }
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [showButton]);

  return (
    <div ref={ref} className="relative">
      {children}
      {m && (
        <>
          {/* Connector strokes: same dotted rule-x pattern as the rail's own
              vertical rule, just a 1px-wide sliver bridging the gap between
              two real rule endpoints — never extending past either one. */}
          {[...m.above, ...(m.incoming ?? [])].map((seg, i) => (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute w-px rule-x hidden md:block"
              style={{ left: seg.x - 0.5, top: seg.top, height: seg.height }}
            />
          ))}
          {m.buttonTop !== null && (
            // left + -translate-x-1/2, same as the top-left button
            // (left-[0.5px] -translate-x-1/2) — not a mirrored
            // right-anchored +translate-x-1/2. z-[15], matching the rule-x
            // it sits on, so it falls under the bottom scroll fade too.
            <div
              className="absolute z-[15] hidden -translate-x-1/2 -translate-y-1/2 md:block"
              style={{ left: m.rightX, top: m.buttonTop }}
            >
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="xs"
                square
                aria-label="Add"
                className="h-[18px] w-[18px] text-text-disabled-300 hover:bg-bg-weak-50 hover:text-text-soft-400"
              >
                <PlusIcon />
              </Button.Root>
            </div>
          )}
        </>
      )}
    </div>
  );
}
