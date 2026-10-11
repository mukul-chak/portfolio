"use client";

import { useId, useState, type ReactNode } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import RuleJunction from "@/components/ui/RuleJunction";

const TRANSITION_MS = 400;

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A frame-width rule carrying a plus at each vertical it crosses — the outer
 * frame pair and the inner column pair.
 *
 * The column marks are addressed as the edges of a box given the same
 * mx-auto max-w-column centring that places the column rules themselves, so
 * the two agree by construction rather than by a measured offset. Layering
 * follows the rule each mark sits on, as everywhere else: z-[18] on the outer
 * rule, which is exempt from the bottom scroll fade, z-[15] on the column
 * rules, which fade with it.
 */
function Rule({ id, className = "" }: { id?: string; className?: string }) {
  return (
    <div id={id} className={`relative ${className}`}>
      <div className="rule-t" />
      <RuleJunction className="left-[0.5px] top-[0.5px] z-[18] -translate-x-1/2 -translate-y-1/2" />
      <RuleJunction className="right-[0.5px] top-[0.5px] z-[18] translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="relative mx-auto h-full max-w-column">
          <RuleJunction className="pointer-events-auto left-[0.5px] top-[0.5px] z-[15] -translate-x-1/2 -translate-y-1/2" />
          <RuleJunction className="pointer-events-auto right-[0.5px] top-[0.5px] z-[15] translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}

/**
 * Section accordion built from the page's own rule system: a frame-width rule,
 * a title row, a second rule, and the collapsible content beneath.
 *
 * `children` is whatever the section already was — this only wraps it, so the
 * content keeps its own rails, dividers and junctions untouched.
 *
 * The column verticals deliberately do not run through the title band: the
 * caller's rail above stops at the top rule and the content's own rails begin
 * at the bottom one, leaving the band clear. The outer frame rule does run
 * through, since it's pinned to the viewport rather than being part of the
 * page flow.
 */
export default function RuleAccordion({
  title,
  anchorId,
  defaultOpen = true,
  children,
}: {
  title: string;
  /** id + scroll offset for in-page links; lands on the top rule. */
  anchorId?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // True only while the rows transition is actually running. Drives two
  // things that must NOT be tied to `open` alone:
  //
  // - overflow. Clipping is needed while the content slides, but the content
  //   carries junction marks that sit half outside the frame's own width, so
  //   leaving it clipped once open would shave them off.
  // - visibility. Hiding collapsed content takes it out of the tab order,
  //   but applying it during the collapse would make the content vanish
  //   instead of sliding away.
  const [animating, setAnimating] = useState(false);
  const contentId = useId();

  const clipped = !open || animating;
  const closed = !open && !animating;

  return (
    <>
      <Rule id={anchorId} className={anchorId ? "scroll-mt-[61px]" : ""} />

      <button
        type="button"
        onClick={() => {
          setAnimating(true);
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-controls={contentId}
        className="group block w-full cursor-pointer text-left"
      >
        {/* py-1 against the label's own 24px line box gives the 32px band.
            The row is column-width so the title and chevron line up with the
            column rules, while the button itself spans the full band — the
            whole strip between the two rules is the target, not just the
            text. */}
        <div className="mx-auto flex max-w-column items-center justify-between px-4 py-1">
          <SectionLabel>{title}</SectionLabel>
          <span
            className={`motion-transform text-text-sub-600 transition-[transform,color] duration-200 ease-[var(--ease-out)] group-hover:text-text-strong-950 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Chevron />
          </span>
        </div>
      </button>

      <Rule />

      {/* grid-template-rows 0fr→1fr, so the content animates to its own
          height without that height ever being measured or hardcoded. */}
      <div
        id={contentId}
        className="grid transition-[grid-template-rows] ease-[var(--ease-out)] motion-reduce:transition-none"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionDuration: `${TRANSITION_MS}ms`,
        }}
        onTransitionEnd={(e) => {
          if (e.propertyName === "grid-template-rows") setAnimating(false);
        }}
      >
        {/* min-w-0: a grid item defaults to min-width:auto, so it refuses to
            shrink below its content's intrinsic width — and the carousels
            are a flex row of fixed-width cards several thousand pixels
            wide. Without this the column sizes to that instead of to the
            frame, and the whole section is dragged off to the right. */}
        <div
          className={`min-w-0 ${clipped ? "overflow-hidden" : ""}`}
          style={closed ? { visibility: "hidden" } : undefined}
        >
          {children}
        </div>
      </div>
    </>
  );
}
