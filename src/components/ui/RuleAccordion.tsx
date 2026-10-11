"use client";

import { useId, useState, type ReactNode } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import RuleJunction from "@/components/ui/RuleJunction";

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A frame-width rule carrying a plus where it meets the outer frame rules.
 *
 * Only the outer pair. The column rules cross these too, but a mark at each
 * would put four pluses on every accordion edge and crowd the band; the
 * section's own boundaries read better marked at the frame. z-[18] matches
 * the outer rule these sit on, which is exempt from the bottom scroll fade.
 */
function Rule({ id, className = "" }: { id?: string; className?: string }) {
  return (
    <div id={id} className={`relative ${className}`}>
      <div className="rule-t" />
      <RuleJunction className="left-[0.5px] top-[0.5px] z-[18] -translate-x-1/2 -translate-y-1/2" />
      <RuleJunction className="right-[0.5px] top-[0.5px] z-[18] translate-x-1/2 -translate-y-1/2" />
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
  sharesRuleAbove = false,
  children,
}: {
  title: string;
  /** id + scroll offset for in-page links; lands on the rule above the title. */
  anchorId?: string;
  defaultOpen?: boolean;
  /**
   * Omit this accordion's own upper rule and sit directly beneath whatever
   * line already ends the section above — the previous accordion's lower
   * rule when that one is shut, its last divider when it's open. Stacking
   * two accordions each drawing their own boundary would put two 1px lines
   * against each other.
   */
  sharesRuleAbove?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <>
      {!sharesRuleAbove && (
        <Rule id={anchorId} className={anchorId ? "scroll-mt-[61px]" : ""} />
      )}

      <button
        {...(sharesRuleAbove && anchorId ? { id: anchorId } : {})}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className={`group block w-full cursor-pointer text-left ${
          sharesRuleAbove && anchorId ? "scroll-mt-[61px]" : ""
        }`}
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

      {/* Toggled outright, with no height animation.
          grid-template-rows 0fr→1fr was tried here and stuttered: it's some
          2100px of content across four carousels, and the browser has to
          re-lay out all of it every frame. Going straight to the end state
          is the honest version — and it takes the grid with it, along with
          the min-width:0 that a grid item needs to stop sizing itself to the
          carousels' intrinsic width, and the overflow/visibility juggling
          that only existed to keep the junction marks unclipped mid-slide.

          The `hidden` attribute rather than a class: it removes the content
          from layout, the accessibility tree and the tab order in one go,
          and nothing here sets a `display` that would override it. */}
      <div id={contentId} hidden={!open}>
        {children}
      </div>
    </>
  );
}
