"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Segment = { x: number; top: number; height: number };

type Measurements = {
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
 * the rail"). Rule crossings carry no marks anywhere on the page.
 *
 * All positions are measured at runtime (getBoundingClientRect), not
 * hardcoded — a hardcoded px offset here previously drifted out of sync
 * the moment upstream content height changed.
 */
export default function CarouselJunctionButton({
  children,
}: {
  children: ReactNode;
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

      setM({ above, incoming });
    }
    measure();
    document.fonts?.ready.then(measure);
    // Any change to this wrapper's size moves the rule endpoints — a
    // spacing change, a font swap, an accordion settling, a viewport
    // resize — and a stale measurement leaves the connectors short of the
    // dividers. Observing the wrapper catches all of them; the connectors
    // are absolute, so drawing them can't resize it and loop.
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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
        </>
      )}
    </div>
  );
}
