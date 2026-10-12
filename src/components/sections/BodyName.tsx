"use client";

import { useRef, useEffect, useState } from "react";
import { phase } from "@/lib/phase";
import Avatar from "@/components/ui/Avatar";

// The header's own height — the y at which something has passed below the nav.
const TRIGGER_Y = 45;

/**
 * What the header listens to. Both numbers are fractions of the same run, so
 * the header can time itself against real layout events here without knowing
 * anything about this component's spacing.
 */
export type NameHandoff = {
  /** 0 at the top of the page, 1 once this name has passed entirely behind
   *  the header. */
  progress: number;
  /** The fraction of that run at which this name's bottom clears the nav's
   *  bottom edge — the moment it has gone fully below the bar, and the
   *  earliest the header's own copy of the name has any business appearing. */
  clearedNav: number;
  /** The fraction at which this name's top first meets the nav's bottom
   *  edge, i.e. where it starts disappearing behind the bar. */
  enteredNav: number;
};

export default function BodyName() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [handoff, setHandoff] = useState<NameHandoff>({
    progress: 0,
    clearedNav: 1,
    enteredNav: 1,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    let last = "";

    function measure() {
      ticking = false;
      const rect = el!.getBoundingClientRect();
      // Document-space, so it's independent of where we currently are.
      const docBottom = rect.bottom + window.scrollY;
      if (docBottom <= 0) return;

      // The run ends when this name has gone completely behind the header —
      // the header is sticky at the viewport top, so that's simply when the
      // name's bottom reaches y=0. Everything downstream is a fraction of
      // this, derived rather than hand-set, so the choreography survives any
      // change to the spacing above.
      const progress = Math.min(1, Math.max(0, window.scrollY / docBottom));
      const clearedNav = Math.max(0, (docBottom - TRIGGER_Y) / docBottom);
      const enteredNav = Math.max(0, (docBottom - rect.height - TRIGGER_Y) / docBottom);

      const next = { progress: Math.round(progress * 1000) / 1000, clearedNav, enteredNav };
      // Compare at a fine but bounded precision so we don't re-render (and
      // re-dispatch) on every sub-pixel scroll tick.
      const key = `${next.progress}|${clearedNav.toFixed(4)}|${enteredNav.toFixed(4)}`;
      if (key === last) return;
      last = key;
      setHandoff(next);
      window.dispatchEvent(new CustomEvent("name-scroll-progress", { detail: next }));
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

  // Fades exactly while crossing behind the nav — from the moment its top
  // meets the bar to the moment its bottom clears it. The header is only
  // semi-opaque, so without this the name would be legible through it.
  const { progress, enteredNav, clearedNav } = handoff;

  return (
    <div style={{ opacity: 1 - phase(progress, enteredNav, clearedNav) }}>
      {/* 84 + 32 + 24 = the 140px this h1 used to carry as its own top
          padding, so the name stays exactly where it was and the header
          handoff — which measures this element's position — is untouched. */}
      <div className="pt-[84px]">
        <Avatar />
      </div>
      <h1 ref={ref} className="mt-6 text-[17px] sm:text-[18px] font-medium text-text-strong-950">
        Mukul Chakravarthi
      </h1>
      <p className="text-[17px] sm:text-[18px] font-normal text-text-sub-600">Product Designer</p>
    </div>
  );
}
