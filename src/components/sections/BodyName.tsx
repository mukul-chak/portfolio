"use client";

import { useRef, useEffect, useState } from "react";

// The header's "collision" boundary — matches its own height, roughly.
const TRIGGER_Y = 45;
// How far above that boundary the handoff animation plays out (a short,
// snappy zone right at the approach, not the whole scroll from page top).
const APPROACH_PX = 70;

export default function BodyName() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    let last = -1;

    function measure() {
      ticking = false;
      const bottom = el!.getBoundingClientRect().bottom;
      const raw = (TRIGGER_Y + APPROACH_PX - bottom) / APPROACH_PX;
      const next = Math.min(1, Math.max(0, raw));
      // Compare at a fine but bounded precision so we don't re-render (and
      // re-dispatch) on every sub-pixel scroll tick.
      const rounded = Math.round(next * 1000) / 1000;
      if (rounded !== last) {
        last = rounded;
        setProgress(rounded);
        window.dispatchEvent(new CustomEvent("name-scroll-progress", { detail: rounded }));
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <h1
      ref={ref}
      className="pt-[140px] text-[18px] font-medium text-text-strong-950"
      style={{ opacity: 1 - progress }}
    >
      Mukul Chakravarthi
    </h1>
  );
}
