"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Segment = { x: number; top: number; height: number };

/**
 * Wraps Bio's Rail (the first one on the page) and bridges its own rule-x
 * — the narrower column verticals immediately flanking the bio/project
 * text, not the wide outer-frame rule — up to the header's bottom edge.
 *
 * Unlike the outer frame rule's earlier scroll-collision fix, this gap
 * doesn't need `position: fixed`: it's a one-time document-flow fact
 * (Header's own height + the pt-3 spacing before Rail begins), not
 * something that recurs at every scroll position. A normal, absolutely
 * positioned connector measured once on mount scrolls naturally with the
 * rest of the page and stays correct everywhere, the same way the
 * carousel "incoming" connectors already work.
 */
export default function HeaderRuleConnector({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [segments, setSegments] = useState<[Segment, Segment] | null>(null);

  useEffect(() => {
    function measure() {
      const el = ref.current;
      const header = document.querySelector("header");
      const rule = el?.querySelector<HTMLElement>(".rule-x");
      if (!el || !header || !rule) return;

      const elRect = el.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const ruleRect = rule.getBoundingClientRect();

      const leftX = ruleRect.left - elRect.left + 0.5;
      const rightX = ruleRect.right - elRect.left - 0.5;
      const top = headerRect.bottom - elRect.top;
      const height = ruleRect.top - headerRect.bottom;

      setSegments([
        { x: leftX, top, height },
        { x: rightX, top, height },
      ]);
    }
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
      {segments &&
        segments.map((seg, i) => (
          <div
            key={i}
            aria-hidden
            // z-[15], matching the outer frame rule: this segment sits at
            // y 45-57, inside Frame's always-on top gradient overlay
            // (z-[9], no opacity toggle unlike TopScrim) — without an
            // explicit z-index this rendered at the implicit ~0 layer,
            // right underneath it, and the gradient washed out the faint
            // dotted line almost completely at that height.
            className="pointer-events-none absolute z-[15] w-px rule-x hidden md:block"
            style={{ left: seg.x - 0.5, top: seg.top, height: seg.height }}
          />
        ))}
    </div>
  );
}
