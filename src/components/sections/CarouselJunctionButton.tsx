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

type Measurements = {
  x: number;
  buttonTop: number;
  aboveTop: number;
  aboveHeight: number;
  belowTop: number;
  belowHeight: number;
};

/**
 * Wraps a Rail + Filmstrip pair and adds a plus button at the junction of
 * the rail's right vertical rule and the solid divider above the carousel —
 * plus short connector strokes closing the gap on both sides, so the
 * vertical line is genuinely continuous through the button (a standing
 * requirement, not just a one-off fix).
 *
 * Positions are measured at runtime (getBoundingClientRect), not
 * hardcoded — a hardcoded px offset here previously drifted out of sync
 * the moment upstream content height changed (e.g. removing the project
 * CTA shrank the rail and silently left the button floating over the
 * carousel instead of on the divider).
 */
export default function CarouselJunctionButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Measurements | null>(null);

  useEffect(() => {
    function measure() {
      const el = ref.current;
      if (!el) return;
      const rule = el.querySelector<HTMLElement>(".rule-x");
      const divider = el.querySelector<HTMLElement>("[data-rule-divider]");
      const carouselRow = el.querySelector<HTMLElement>("[data-carousel-row]");
      if (!rule || !divider || !carouselRow) return;

      const elRect = el.getBoundingClientRect();
      const ruleRect = rule.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      const carouselRect = carouselRow.getBoundingClientRect();
      const dividerCenterY = dividerRect.top + dividerRect.height / 2;

      setM({
        x: ruleRect.right - elRect.left,
        buttonTop: dividerCenterY - elRect.top,
        aboveTop: ruleRect.bottom - elRect.top,
        aboveHeight: dividerRect.top - ruleRect.bottom,
        belowTop: dividerRect.bottom - elRect.top,
        belowHeight: carouselRect.top - dividerRect.bottom,
      });
    }
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
      {m && (
        <>
          {/* Connector strokes: same dotted rule-x pattern as the rail's own
              vertical rule, just a 1px-wide sliver bridging the two gaps
              (rail-bottom → divider, divider → carousel row) so nothing
              breaks the line. */}
          <div
            aria-hidden
            className="pointer-events-none absolute w-px rule-x hidden md:block"
            style={{ left: m.x, top: m.aboveTop, height: m.aboveHeight }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute w-px rule-x hidden md:block"
            style={{ left: m.x, top: m.belowTop, height: m.belowHeight }}
          />
          <div
            className="absolute z-20 hidden translate-x-1/2 -translate-y-1/2 md:block"
            style={{ left: m.x, top: m.buttonTop }}
          >
            <Button.Root
              variant="neutral"
              mode="ghost"
              size="xs"
              square
              aria-label="Add"
              className="text-text-disabled-300 hover:bg-bg-weak-50 hover:text-text-soft-400"
            >
              <PlusIcon />
            </Button.Root>
          </div>
        </>
      )}
    </div>
  );
}
