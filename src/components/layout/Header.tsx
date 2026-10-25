"use client";

import { useState, useEffect, useRef } from "react";
import LocationTime from "@/components/ui/LocationTime";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { phase } from "@/lib/phase";
import type { NameHandoff } from "@/components/sections/BodyName";

const FULL_NAME = "Mukul Chakravarthi";
const LEAVE_MS = 200;

// A caret types the name in. It rests blinking at the name's insertion
// point, then, as the page scrolls, jumps one character at a time, each
// letter appearing whole as the caret steps past it; once the name is
// complete the caret fades out.
//
// Characters are typed linearly across the whole run, 0 to 1 — the same
// pace the strokes it replaces opened at. Any ease-out spends most of the
// journey in the first fraction of the scroll and then crawls, which read
// as a snap.
//
// Under reduced motion nothing travels: the caret stays at the insertion
// point, steady, and the name crossfades in over the old window, from the
// moment the body name clears the nav bar (clearedNav) to the end of the
// run, squared so it resolves late rather than reading as arrived early.

export default function Header({ tz }: { tz?: string }) {
  const [handoff, setHandoff] = useState<NameHandoff>({
    progress: 0,
    clearedNav: 1,
    enteredNav: 1,
    room: true,
  });
  // When the page stops having room for the run while the header is
  // showing (a section shut beneath it), the handoff drops straight to 0.
  // Rather than snap away, the header holds its last frame and fades out
  // whole, then takes the new state.
  const lastRef = useRef(handoff);
  const [leaving, setLeaving] = useState<NameHandoff | null>(null);
  const reducedMotion = useReducedMotion();
  const nameRef = useRef<HTMLSpanElement>(null);
  // Where the caret can stand: before each character and after the last,
  // in px from the name's origin. Empty until measured.
  const [stops, setStops] = useState<number[]>([]);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    function onNameScroll(e: Event) {
      const next = (e as CustomEvent<NameHandoff>).detail;
      const prev = lastRef.current;
      lastRef.current = next;
      if (!next.room && prev.room && prev.progress > 0) setLeaving(prev);
      setHandoff(next);
    }
    window.addEventListener("name-scroll-progress", onNameScroll);
    return () => window.removeEventListener("name-scroll-progress", onNameScroll);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(() => setLeaving(null), LEAVE_MS);
    return () => clearTimeout(id);
  }, [leaving]);

  // Each character's position comes from the laid-out text itself (a
  // Range per character), so it has to be measured against the real
  // webfont, not the fallback that renders first. No resize listener: it's
  // font-intrinsic and the name's size is fixed.
  useEffect(() => {
    function measure() {
      const el = nameRef.current;
      const text = el?.firstChild;
      if (!el || !text) return;
      const origin = el.getBoundingClientRect().left;
      const range = document.createRange();
      const next: number[] = [];
      for (let i = 0; i < FULL_NAME.length; i++) {
        range.setStart(text, i);
        range.setEnd(text, i + 1);
        next.push(range.getBoundingClientRect().left - origin);
      }
      next.push(el.getBoundingClientRect().width);
      setStops(next);
      setDpr(window.devicePixelRatio || 1);
    }
    measure();
    document.fonts?.ready.then(measure);
  }, []);


  const { progress, clearedNav, enteredNav } = leaving ?? handoff;
  // The header's own run: from the moment the body name meets the nav's
  // bottom edge to the moment it's fully behind it. Starting at the top of
  // the page instead had the name typing while the bio's still sat well
  // below the bar.
  const run = phase(progress, enteredNav, 1);
  // Snapped to whole device pixels, so the caret stays exactly as crisp in
  // motion as at rest instead of thinning across sub-pixel phases.
  const typed = reducedMotion ? 0 : run;
  // Characters typed so far. floor, with 1 itself mapping to the full name,
  // so each character gets an equal share of the run and the last lands
  // exactly at the end of it.
  const count = Math.min(FULL_NAME.length, Math.floor(typed * FULL_NAME.length));
  const caretX = stops.length ? Math.round(stops[count] * dpr) / dpr : 0;
  const nameWidth = stops.length ? stops[FULL_NAME.length] : 0;
  const done = count === FULL_NAME.length;
  // Holds steady while typing and blinks whenever it's waiting — at the
  // insertion point, or paused mid-name when the scroll stops — as a real
  // caret does. "Typing" is a character landing in the last 530ms, one blink
  // phase, so a steady scroll never flickers between letters.
  const [typing, setTyping] = useState(false);
  const lastCount = useRef(count);
  useEffect(() => {
    if (count === lastCount.current) return;
    lastCount.current = count;
    setTyping(true);
    const id = setTimeout(() => setTyping(false), 530);
    return () => clearTimeout(id);
  }, [count]);
  // Not once the name is done: the blink animates opacity, and would
  // override the fade-out.
  // And not before typing starts: the caret isn't shown at the very top,
  // and the blink would override that too.
  const idle = !typing && !done && run > 0;
  const crossfade = Math.pow(phase(progress, clearedNav, 1), 2);
  const nameOpacity = reducedMotion ? crossfade : 1;
  // At the very top there's no header at all — no caret, bar, line, links
  // or clock, just the frame's verticals running to the top edge. The
  // caret first appears as typing starts; the bar's fill and bottom line,
  // the nav links and the clock fade in with the name, on the same run
  // (under reduced motion, with the name's crossfade).
  const started = run > 0;
  const caretOpacity = !started ? 0 : reducedMotion ? 1 - crossfade : done ? 0 : 1;
  const chrome = reducedMotion ? crossfade : run;

  // z-[25]: above every z-20 element in the scrolling page (ThemeToggle)
  // that could otherwise visually collide with the sticky header — equal
  // z-index falls back to DOM order, and those render after Header, so
  // they were painting on top of it. Still below
  // the z-40 spotlight scrim, so the header keeps dimming with everything
  // else during a hover preview.
  return (
    // -mb-[45px]: the header is invisible at the top of the page, so it no
    // longer holds its 45px open — the bio starts that much higher and the
    // header, still sticky, floats over the page as it appears.
    <header
      className="sticky top-0 z-[25] -mb-[45px] transition-opacity ease-[var(--ease-out)]"
      style={{ opacity: leaving ? 0 : 1, transitionDuration: `${LEAVE_MS}ms` }}
    >
      {/* The bar's frosted fill, on its own layer so it can fade with the
          name (a backdrop-filter can't be faded on the header itself). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background/70 backdrop-blur-md"
        style={{ opacity: chrome }}
      />
      {/* The bottom line fades too. Its 1px border stays in place, only
          transparent, so the header holds its 45px and nothing below moves. */}
      <div
        className="relative border-b"
        style={{
          borderBottomColor: `color-mix(in oklab, var(--color-rule) ${Math.round(chrome * 100)}%, transparent)`,
        }}
      >
        {/* Runs the header's full height, edge to edge: from the very top
            of the viewport (no 8px clearance any more — the frame's
            verticals start at the top of the screen) down to the header's
            bottom edge, so it runs seamlessly into the page's outer rule
            below — no gap at either end.
            bottom-[-1px], not bottom-0: an absolutely-positioned child's
            inset resolves against its containing block's *padding* edge,
            which sits 1px above this ancestor's own border-b (its border
            edge) — bottom-0 alone left a 1px gap short of it. rule-x, not
            border-x border-rule: matches the now-dotted outer rule below
            it instead of being the one remaining solid vertical. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[-1px] top-0 rule-x"
        />
        <div className="relative px-4 py-2 leading-none">
          {/* Name: absolute overlay, positioned over the header at all times.
              The two marks rest here and open into the full name as the bio
              title approaches (see progress, driven by BodyName's scroll
              position) — at every breakpoint. Mobile used to get a plain
              binary crossfade instead; there's nothing width-dependent in
              the marks, so there was no reason to keep two behaviours. */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-column px-4">
              {/* The caret and the name are one link back to the top. The
                  overlay is pointer-events-none so the nav stays clickable;
                  the link opts back in. The name is laid out at full width
                  even while hidden, so the target covers the caret at every
                  point in the handoff. Plain scrollTo, so the glide
                  follows the page's own scroll-behavior (none under reduced
                  motion), and the hash is cleared so a reload starts at the
                  top too. */}
              <a
                href="#"
                aria-label={`${FULL_NAME}, back to top`}
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0 });
                  history.replaceState(null, "", location.pathname + location.search);
                }}
                className="pointer-events-auto inline-block whitespace-nowrap rounded-sm text-[18px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-strong-950"
              >
                {/* The caret hangs off a zero-width, zero-height
                    inline-block at the name's text origin, on its baseline:
                    it adds nothing to the flow or the line box, so the name
                    sits exactly where it always did, and the caret's offsets
                    are straight from the origin. 2px wide, centred on the
                    insertion point; 1.1em tall, from 0.85em above the
                    baseline to 0.25em below — the line's ascender to
                    descender, as a text caret spans it. */}
                <span aria-hidden className="relative inline-block h-0 w-0 align-baseline">
                  <span
                    // The fade after typing is a short transition rather
                    // than scroll-driven: the run ends on the last letter,
                    // so there's no scroll left to drive it with.
                    className={`absolute bottom-[-0.25em] h-[1.1em] w-[2px] bg-text-strong-950 transition-opacity duration-300 ease-[var(--ease-out)] ${idle ? "caret-blink" : ""}`}
                    style={{ left: caretX - 1, opacity: caretOpacity }}
                  />
                </span>
                {/* Always laid out at full width — its width is the
                    caret's journey, and the link's hit area — and clipped
                    to the left of the caret, so only what's been typed
                    shows. */}
                <span
                  ref={nameRef}
                  className="text-text-strong-950"
                  style={{
                    opacity: nameOpacity,
                    // Fully clipped until measured, so the server render
                    // and first paint don't flash the whole name.
                    clipPath: reducedMotion
                      ? undefined
                      : `inset(0 ${nameWidth ? `${nameWidth - caretX}px` : "100%"} 0 0)`,
                  }}
                >
                  {FULL_NAME}
                </span>
              </a>
            </div>
          </div>

          {/* No nav links — the header is just the name, the caret and
              the clock. h-7 holds the row at 28px so the header stays 45px,
              the height the sticky offsets below assume. */}
          <div className="mx-auto h-7 max-w-column" />

          {/* The clock, at the outer stroke, from md — date and 24-hour
              time with seconds, as the footer sets it. With no nav links
              there's nothing for it to run into from md up; below md the
              name would, so the footer carries it there. */}
          <div
            className="absolute right-4 top-1/2 hidden -translate-y-[calc(50%-2px)] md:block"
            style={{ opacity: chrome, visibility: started ? undefined : "hidden" }}
          >
            <LocationTime tz={tz} seconds />
          </div>
        </div>
      </div>

    </header>
  );
}
