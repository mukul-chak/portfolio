"use client";

import { useState, useEffect, useRef } from "react";
import { EMAIL } from "@/content/site";
import * as Button from "@/components/ui/Button";
import LocationTime from "@/components/ui/LocationTime";
import { useReducedMotion } from "@/lib/useReducedMotion";

const NAV = [
  { label: "Profile", href: "#" },
  { label: "Writing", href: "#" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Snappy: C reaches its final position well before progress hits 1, rather
// than crawling in lockstep with scroll for the whole zone. Only applied to
// C's movement — the letter fades stay on raw (linear) progress.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// Slight tracking between M and C in the neutral "MC" state only — added on
// top of C's existing snap-to-M offset, on the same eased curve, so it
// converges to exactly 0 by the time progress reaches 1. The real
// "Mukul Chakravarthi" typesetting below is never touched by this — it's
// purely an extra term in C's own transform.
const MC_TRACKING_PX = 1.8;

export default function Header({
  city,
  tz,
}: {
  city?: string;
  tz?: string;
}) {
  const [open, setOpen] = useState(false);
  // Mirrors Bio's hover-preview pattern: `menuRendered` stays true for one
  // exit-duration after `open` goes false, so the dropdown can fade/scale
  // out instead of vanishing on unmount.
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLSpanElement>(null);
  const [gapWidth, setGapWidth] = useState(0);

  useEffect(() => {
    if (open) {
      setMenuRendered(true);
      const id = requestAnimationFrame(() => setMenuVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setMenuVisible(false);
    const id = setTimeout(() => setMenuRendered(false), 180);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    function onNameScroll(e: Event) {
      setProgress((e as CustomEvent<number>).detail);
    }
    window.addEventListener("name-scroll-progress", onNameScroll);
    return () => window.removeEventListener("name-scroll-progress", onNameScroll);
  }, []);

  // Width of "ukul " — the substring between M and C — at this exact font/
  // size/weight, so C can be pulled back to sit immediately after M (reading
  // as "MC") and eased back out to its natural position as progress runs 0→1.
  // Remeasured once the real webfont has swapped in, not just the fallback.
  useEffect(() => {
    function measure() {
      if (gapRef.current) setGapWidth(gapRef.current.getBoundingClientRect().width);
    }
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Reduced motion: drop the eased "snap" and track raw scroll 1:1 instead —
  // gentler, not zero, since the travel itself is still directly under the
  // user's own scroll input.
  const eased = reducedMotion ? progress : easeOutCubic(progress);
  // C's offset: pulled back to sit flush against M at progress 0, eased back
  // out to its natural position by progress 1. MC_TRACKING_PX rides the same
  // (1 - eased) factor, so the neutral state gets slight added tracking that
  // converges to exactly 0 — never a leftover offset once C reaches its real,
  // untracked position in "Mukul Chakravarthi".
  const cOffset = (gapWidth - MC_TRACKING_PX) * (1 - eased);

  // z-[25]: above every z-20 element in the scrolling page (RecentWork's
  // plus buttons, ThemeToggle) that could otherwise visually collide with
  // the sticky header — equal z-index falls back to DOM order, and those
  // render after Header, so they were painting on top of it. Still below
  // the z-40 spotlight scrim, so the header keeps dimming with everything
  // else during a hover preview.
  return (
    <header className="sticky top-0 z-[25] bg-background/70 backdrop-blur-md">
      <div className="relative border-b border-rule">
        {/* Reaches the header's own bottom edge (not inset-y-2 on both
            sides) so it runs seamlessly into the plus buttons below, and
            from there into the page's outer rule — no gap at either
            junction. Top keeps its 8px clearance; only the bottom, where
            the strokes now need to be continuous, touches the edge.
            bottom-[-1px], not bottom-0: an absolutely-positioned child's
            inset resolves against its containing block's *padding* edge,
            which sits 1px above this ancestor's own border-b (its border
            edge) — bottom-0 alone left a 1px gap short of it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[-1px] top-2 border-x border-rule"
        />
        {/* Junction of the header's own bottom border with its left/right
            edges — same x-position as the outer frame's vertical rule below
            (both inset-x-0 against the same Frame content width).
            left-[0.5px], not left-0: the outer rule's own border-x is a
            real CSS border, whose 1px line sits INSIDE its box edge (the
            box's own getBoundingClientRect().left is the border's outer
            face, not its center) — center = edge + 0.5px, same convention
            as everywhere else. left-0 was off by a real, measurable 0.5px. */}
        <div className="absolute bottom-[-1px] left-[0.5px] z-20 hidden -translate-x-1/2 translate-y-1/2 md:block">
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
        <div className="absolute bottom-[-1px] right-[0.5px] z-20 hidden translate-x-1/2 translate-y-1/2 md:block">
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
        <div className="relative px-4 py-2 leading-none">
          {/* Name: absolute overlay, positioned over the header at all times.
              Desktop: "MC" sits here from the start and steadily spreads
              into the full name as the bio title approaches (see progress,
              driven by BodyName's scroll position). Mobile keeps the
              original simple crossfade, unchanged. */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-column px-4">
              <span
                className="hidden whitespace-nowrap text-[18px] font-medium md:inline-block"
                style={{
                  color: `color-mix(in srgb, var(--color-text-disabled-300) ${(1 - progress) * 100}%, var(--color-text-strong-950) ${progress * 100}%)`,
                }}
              >
                <span>M</span>
                <span ref={gapRef} style={{ opacity: progress }}>
                  ukul{" "}
                </span>
                <span
                  className="inline-block"
                  style={{ transform: `translateX(-${cOffset}px)` }}
                >
                  C
                </span>
                <span style={{ opacity: progress }}>hakravarthi</span>
              </span>
              <span
                className={`whitespace-nowrap text-[18px] font-medium text-text-strong-950 transition-opacity duration-300 md:hidden ${
                  progress >= 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                Mukul Chakravarthi
              </span>
            </div>
          </div>

          {/* Nav items: right-aligned, name is not in flex flow */}
          <div className="mx-auto flex max-w-column items-center justify-end">
            <div className="flex items-center gap-1.5">
              {/* Desktop nav */}
              <nav className="hidden gap-0.5 md:flex">
                {NAV.map((item) => (
                  <Button.Root
                    key={item.label}
                    asChild
                    variant="neutral"
                    mode="ghost"
                    size="xs"
                    className="text-[17px] font-normal"
                  >
                    <a href={item.href}>{item.label}</a>
                  </Button.Root>
                ))}
              </nav>

              {/* Mobile + menu */}
              <div className="relative md:hidden" ref={menuRef}>
                <Button.Root
                  variant="neutral"
                  mode="ghost"
                  size="xs"
                  className="text-[20px] font-normal"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Menu"
                >
                  {open ? "×" : "+"}
                </Button.Root>
                {menuRendered && (
                  <div
                    className={`motion-transform absolute right-0 top-full z-30 mt-1 min-w-[140px] rounded-lg border border-rule bg-background py-1 shadow-md transition-[opacity,transform] duration-[180ms] ${
                      menuVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
                    }`}
                    style={{ transitionTimingFunction: "var(--ease-out)", transformOrigin: "top right" }}
                  >
                    {NAV.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 text-[15px] text-text-sub-600 hover:bg-card"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location/time — outer stroke position on desktop only */}
          <div className="absolute right-4 top-1/2 hidden -translate-y-[calc(50%-2px)] md:block">
            <LocationTime city={city} tz={tz} />
          </div>
        </div>
      </div>
    </header>
  );
}
