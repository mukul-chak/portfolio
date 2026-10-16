"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import RuleJunction from "@/components/ui/RuleJunction";

// 200ms, per the accordion recipe. Height is the one layout property
// sanctioned for this — there's no transform equivalent for "take up less
// room" — but it costs layout on every frame, so the duration buys as few
// of those frames as possible. The first attempt at this ran 400ms on
// grid-template-rows and stuttered; half the frames and a measured pixel
// height instead of fr sizing is the difference.
const DURATION_MS = 200;

/**
 * Dispatched by in-page nav links so the section they point at opens as well
 * as scrolls. A plain hash change can't carry this on its own: clicking the
 * same link twice leaves the hash untouched and fires no event, so a section
 * closed by hand would never reopen from the nav.
 */
export const SECTION_TARGET_EVENT = "section-target";

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
export function AccordionRule({ id, className = "" }: { id?: string; className?: string }) {
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
  // "auto" once settled open, so the section can reflow — the carousels and
  // rules inside are measured at runtime and must not be pinned to a stale
  // pixel height. Only ever a number mid-transition.
  const [height, setHeight] = useState(defaultOpen ? "auto" : "0px");
  const [animating, setAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const contentId = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Mirrors `open` for setSection, which has to stay referentially stable so
  // the listener effect below isn't torn down and re-run on every toggle —
  // re-running it would re-check the hash and reopen a section the visitor
  // had just closed by hand.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const setSection = useCallback((next: boolean) => {
    if (next === openRef.current) return;
    const el = contentRef.current;
    if (!el) {
      setOpen(next);
      return;
    }
    window.clearTimeout(timer.current);
    const opening = next;
    setAnimating(true);

    if (opening) {
      // Measured rather than animating to `auto`, which isn't interpolable.
      // Readable while collapsed because the content is hidden with
      // visibility, not display — it stays laid out, so scrollHeight is real.
      setOpen(true);
      setHeight(`${el.scrollHeight}px`);
    } else {
      // Pin the height, then commit it, before React re-renders with 0: a
      // transition needs a resolved starting value and `auto` isn't one.
      //
      // Set on the node and flushed with a forced reflow rather than
      // deferred to requestAnimationFrame. rAF is throttled whenever the
      // page isn't actively painting — a background tab, an occluded
      // window — and the callback can land a second late or not at all,
      // leaving the section pinned open until it does. This path has to be
      // synchronous with the click.
      //
      // The rendered height, not scrollHeight: the two differ by a pixel or
      // ten here, and pinning to the larger one jumps before it moves.
      el.style.height = `${el.getBoundingClientRect().height}px`;
      void el.offsetHeight;
      setOpen(false);
      setHeight("0px");
    }

    // Settled by the clock rather than transitionend: height and opacity
    // finish separately, and whichever fired first would otherwise clear
    // the state — dropping overflow back, or swapping height to auto —
    // while the other was still running.
    timer.current = window.setTimeout(() => {
      setAnimating(false);
      if (opening) setHeight("auto");
    }, DURATION_MS + 60);
  }, []);

  // Open when this section is the target of an in-page link. The hash is
  // read once on mount, for someone arriving on /#contact directly; after
  // that it's driven by events, so re-renders can't reopen a closed section.
  useEffect(() => {
    if (!anchorId) return;
    if (window.location.hash.slice(1) === anchorId) setSection(true);
  }, [anchorId, setSection]);

  useEffect(() => {
    if (!anchorId) return;
    const onHash = () => {
      if (window.location.hash.slice(1) === anchorId) setSection(true);
    };
    const onTarget = (e: Event) => {
      if ((e as CustomEvent<string>).detail === anchorId) setSection(true);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener(SECTION_TARGET_EVENT, onTarget);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener(SECTION_TARGET_EVENT, onTarget);
    };
  }, [anchorId, setSection]);

  return (
    <>
      {!sharesRuleAbove && (
        <AccordionRule id={anchorId} className={anchorId ? "scroll-mt-[61px]" : ""} />
      )}

      <button
        {...(sharesRuleAbove && anchorId ? { id: anchorId } : {})}
        type="button"
        onClick={() => setSection(!openRef.current)}
        aria-expanded={open}
        aria-controls={contentId}
        className={`group relative block w-full cursor-pointer text-left ${
          sharesRuleAbove && anchorId ? "scroll-mt-[61px]" : ""
        }`}
      >
        {/* Hatch, mirrored while open to signal the state. Two stacked
            layers cross-fading rather than one element whose direction
            flips: background-image isn't an animatable property, so a
            single layer would snap to the other diagonal while the section
            was still opening. Same 200ms and curve as the height, so the
            two read as one gesture. */}
        <span
          aria-hidden
          className="hatch pointer-events-none absolute inset-0 transition-opacity ease-[var(--ease-out)]"
          style={{ opacity: open ? 0 : 1, transitionDuration: `${DURATION_MS}ms` }}
        />
        <span
          aria-hidden
          className="hatch-mirror pointer-events-none absolute inset-0 transition-opacity ease-[var(--ease-out)]"
          style={{ opacity: open ? 1 : 0, transitionDuration: `${DURATION_MS}ms` }}
        />
        {/* py-2 against the label's 24px line box gives the 40px band. The
            title is 18px, so the 24px is pinned with leading-6 rather than
            inherited — left to scale it would grow to 27px and the band to 43.
            The row is column-width so the title and chevron line up with the
            column rules, while the button itself spans the full band — the
            whole strip between the two rules is the target, not just the
            text. */}
        <div className="relative mx-auto flex max-w-column items-center justify-between px-4 py-2">
          <SectionLabel className="text-[18px] leading-6">{title}</SectionLabel>
          <span
            className={`motion-transform text-text-sub-600 transition-[transform,color] duration-200 ease-[var(--ease-out)] group-hover:text-text-strong-950 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Chevron />
          </span>
        </div>
      </button>

      <AccordionRule />

      {/* overflow is clipped while closed and while moving, but released
          once open: the content carries junction marks that sit half
          outside the frame's own width and would be shaved off.
          clip, not hidden: hidden makes this a scroll container, and a
          sticky descendant (the resume's export) then sticks to it rather
          than the viewport — sitting 45px down inside the section for the
          length of the open animation, then jumping up when it ended.
          clip cuts off the same way without becoming a scroll container.
          visibility, not display, when fully closed — it keeps the content
          out of the tab order while leaving it laid out, which is what
          makes scrollHeight readable for the measurement above. */}
      <div
        ref={contentRef}
        id={contentId}
        className={`transition-[height,opacity] ease-[var(--ease-out)] motion-reduce:transition-[opacity] motion-reduce:duration-150 ${
          !open || animating ? "overflow-clip" : ""
        }`}
        style={{
          height,
          opacity: open ? 1 : 0,
          transitionDuration: `${DURATION_MS}ms`,
          visibility: !open && !animating ? "hidden" : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
}
