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
  // Visual center of the rail's right rule-x line — the line's own right
  // edge sits at ruleRect.right (background-position: right 0), so its
  // 1px column spans [right-1, right] and its center is right-0.5. Same
  // +0.5px convention as the top-left button's left-[0.5px].
  centerX: number;
  buttonTop: number | null;
  aboveTop: number;
  aboveHeight: number;
  belowTop: number;
  belowHeight: number;
  // Bridges this rail's own rule-x UP to the previous project's Filmstrip
  // closing divider, if one exists as this wrapper's previous sibling
  // (absent for the first project, which sits directly after Bio's rail
  // with no divider between them — already continuous by construction).
  incomingTop: number | null;
  incomingHeight: number;
};

/**
 * Wraps a Rail + Filmstrip pair and keeps the vertical rule genuinely
 * continuous through every horizontal divider around it — its own rail's
 * bottom down through the divider above its carousel, AND (for every
 * project after the first) the divider closing the PREVIOUS project's
 * carousel up into this rail's own rule-x. Optionally also renders a plus
 * button at the rail/divider junction (first project only, by request).
 *
 * All positions are measured at runtime (getBoundingClientRect), not
 * hardcoded — a hardcoded px offset here previously drifted out of sync
 * the moment upstream content height changed (e.g. removing the project
 * CTA shrank the rail and silently left a button floating over the
 * carousel instead of on the divider).
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
      const carouselRow = el.querySelector<HTMLElement>("[data-carousel-row]");
      if (!rule || !divider || !carouselRow) return;

      const elRect = el.getBoundingClientRect();
      const ruleRect = rule.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      const carouselRect = carouselRow.getBoundingClientRect();
      const dividerCenterY = dividerRect.top + dividerRect.height / 2;

      const prevDivider = el.previousElementSibling?.querySelector<HTMLElement>(
        "[data-rule-divider-close]",
      );
      let incomingTop: number | null = null;
      let incomingHeight = 0;
      if (prevDivider) {
        const prevRect = prevDivider.getBoundingClientRect();
        incomingTop = prevRect.bottom - elRect.top;
        incomingHeight = ruleRect.top - prevRect.bottom;
      }

      setM({
        centerX: ruleRect.right - elRect.left - 0.5,
        buttonTop: showButton ? dividerCenterY - elRect.top : null,
        aboveTop: ruleRect.bottom - elRect.top,
        aboveHeight: dividerRect.top - ruleRect.bottom,
        belowTop: dividerRect.bottom - elRect.top,
        belowHeight: carouselRect.top - dividerRect.bottom,
        incomingTop,
        incomingHeight,
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
              vertical rule, just a 1px-wide sliver bridging the gaps so
              nothing breaks the line. */}
          <div
            aria-hidden
            className="pointer-events-none absolute w-px rule-x hidden md:block"
            style={{ left: m.centerX - 0.5, top: m.aboveTop, height: m.aboveHeight }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute w-px rule-x hidden md:block"
            style={{ left: m.centerX - 0.5, top: m.belowTop, height: m.belowHeight }}
          />
          {m.incomingTop !== null && (
            <div
              aria-hidden
              className="pointer-events-none absolute w-px rule-x hidden md:block"
              style={{ left: m.centerX - 0.5, top: m.incomingTop, height: m.incomingHeight }}
            />
          )}
          {m.buttonTop !== null && (
            // left + -translate-x-1/2, same as the top-left button
            // (left-[0.5px] -translate-x-1/2) — not a mirrored
            // right-anchored +translate-x-1/2.
            <div
              className="absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
              style={{ left: m.centerX, top: m.buttonTop }}
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
          )}
        </>
      )}
    </div>
  );
}
