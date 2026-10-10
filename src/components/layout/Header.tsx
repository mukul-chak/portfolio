"use client";

import { useState, useEffect, useRef } from "react";
import { EMAIL } from "@/content/site";
import * as Button from "@/components/ui/Button";
import LocationTime from "@/components/ui/LocationTime";
import ProfileDrawer from "@/components/sections/ProfileDrawer";
import RuleJunction from "@/components/ui/RuleJunction";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { measureNameMark, type NameMark } from "@/lib/measureNameMark";
import { phase } from "@/lib/phase";
import type { NameHandoff } from "@/components/sections/BodyName";

// `panel` items open a drawer instead of navigating. Profile is the only one
// for now; Writing can take a panel id the same way once it has content.
const NAV: { label: string; href?: string; panel?: "profile" }[] = [
  { label: "Profile", panel: "profile" },
  { label: "Writing", href: "#" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

const FULL_NAME = "Mukul Chakravarthi";

// The marks travel linearly across the whole run — no easing. Any ease-out
// spends most of the journey in the first fraction of the scroll and then
// crawls, which is exactly what made this read as a snap. Linear means the
// pair opens at a constant rate the entire way down, from the resting state
// at the top of the page to the merge at the bottom of the run.
//
// Timed against real layout rather than chosen fractions (see NameHandoff):
//
//   marks open   0 ─────────────────────────────────── 1
//   crossfade                          clearedNav ──── 1
//
// clearedNav is the moment the body name's bottom passes below the nav bar.
// Nothing of the header's own name exists before then: it used to start at a
// flat 0.5, which put it on screen while the body name was still ~90px short
// of the bar, with two copies of the name visible at once and neither of
// them arriving at anything.
//
// The crossfade is back-loaded, not linear. Run straight, the name was
// already half-opaque with the mark still a tenth of its journey short —
// legible enough to read as arrived while the thing opening the space for
// it was visibly still moving. Squaring holds it back through most of the
// mark's final approach and resolves it in the last of it, so the name
// lands with the mark rather than ahead of it.
//
// The crossfade runs on one window for both, so the marks dissolve at the
// same rate the letters resolve — and since each mark is sitting on the
// upright it stands in for (the M's, then the i's), the handover happens in
// place rather than as two separate events.

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
  // Which nav drawer is open, if any.
  const [panel, setPanel] = useState<"profile" | null>(null);
  const [handoff, setHandoff] = useState<NameHandoff>({
    progress: 0,
    clearedNav: 1,
    enteredNav: 1,
  });
  const reducedMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [mark, setMark] = useState<NameMark | null>(null);

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
      setHandoff((e as CustomEvent<NameHandoff>).detail);
    }
    window.addEventListener("name-scroll-progress", onNameScroll);
    return () => window.removeEventListener("name-scroll-progress", onNameScroll);
  }, []);

  // The two marks are derived from the M itself (see measureNameMark), so
  // they have to be measured against the real webfont, not the fallback that
  // renders first. No resize listener: every value here is font-intrinsic and
  // the name's size is fixed, so nothing about them is viewport-dependent.
  useEffect(() => {
    function measure() {
      if (nameRef.current) setMark(measureNameMark(nameRef.current, FULL_NAME));
    }
    measure();
    document.fonts?.ready.then(measure);
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

  const { progress, clearedNav } = handoff;
  // The left mark never moves. The right one runs from the M's own second
  // upright out to the name's last one, opening the space the name fills.
  // Snapped to the same device-pixel grid the rest state was measured on, so
  // the mark stays exactly as crisp in motion as it is parked — otherwise it
  // thins and thickens as it drifts across sub-pixel phases.
  //
  // Reduced motion holds the pair at rest instead: the marks stay as the
  // nav's resting identity — dropping them would leave it empty until the
  // name arrives — and the handover becomes a plain crossfade from the two
  // uprights to the name, with nothing travelling.
  const travelled = reducedMotion ? 0 : progress;
  const rightX = mark
    ? Math.round(
        (mark.rightRestX + (mark.rightOpenX - mark.rightRestX) * travelled) * mark.dpr,
      ) / mark.dpr
    : 0;
  const crossfade = Math.pow(phase(progress, clearedNav, 1), 2);
  const nameOpacity = crossfade;
  const markOpacity = 1 - crossfade;

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
            edge) — bottom-0 alone left a 1px gap short of it. rule-x, not
            border-x border-rule: matches the now-dotted outer rule below
            it instead of being the one remaining solid vertical. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[-1px] top-2 rule-x"
        />
        {/* Every crossing of the header's own bottom border: the outer frame
            rule at both page edges, and the narrower column rules inside it.

            bottom-[-0.5px] with translate-y-1/2: this ancestor's padding box
            ends where its 1px border-b begins, so the line's visual centre is
            half a pixel past that edge — bottom-0 centres the mark on the
            padding edge, a real half-pixel high, and bottom-[-1px] the same
            distance low.

            left-[0.5px], not left-0: the rule's 1px line sits inside its own
            box edge, so centre = edge + 0.5px. Same convention everywhere. */}
        <RuleJunction className="bottom-[-0.5px] left-[0.5px] z-20 -translate-x-1/2 translate-y-1/2" />
        <RuleJunction className="bottom-[-0.5px] right-[0.5px] z-20 translate-x-1/2 translate-y-1/2" />
        {/* The column rules cross the same border 310px further in on each
            side. Addressed as the edges of a box given the identical
            mx-auto max-w-column centring that places those rules, so the two
            agree by construction rather than by a measured offset. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="relative mx-auto h-full max-w-column">
            <RuleJunction className="pointer-events-auto bottom-[-0.5px] left-[0.5px] z-20 -translate-x-1/2 translate-y-1/2" />
            <RuleJunction className="pointer-events-auto bottom-[-0.5px] right-[0.5px] z-20 translate-x-1/2 translate-y-1/2" />
          </div>
        </div>
        <div className="relative px-4 py-2 leading-none">
          {/* Name: absolute overlay, positioned over the header at all times.
              Desktop: "MC" sits here from the start and steadily spreads
              into the full name as the bio title approaches (see progress,
              driven by BodyName's scroll position). Mobile keeps the
              original simple crossfade, unchanged. */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-column px-4">
              <span className="hidden whitespace-nowrap text-[18px] font-medium md:inline-block">
                {/* Each mark hangs off a zero-width inline-block sitting at
                    the name's own text origin. Two things fall out of that,
                    both of which would otherwise need measuring:

                    - Vertical. An empty inline-block takes its baseline from
                      its bottom margin edge, so a box of exactly cap height
                      lands on the cap band — no ascent/descent arithmetic,
                      and no risk of the font's reported metrics disagreeing
                      with the line box the browser actually built.
                    - Horizontal. Zero width means it contributes nothing to
                      the flow, so the name starts where it always did and
                      the inner offsets are straight from the text origin —
                      the same origin measureNameMark returned them against. */}
                {mark && (
                  <>
                    <span
                      aria-hidden
                      className="relative inline-block w-0 align-baseline"
                      style={{ height: mark.capHeight }}
                    >
                      <span
                        className="absolute top-0 h-full bg-text-strong-950"
                        style={{
                          left: mark.leftX,
                          width: mark.strokeWidth,
                          opacity: markOpacity,
                        }}
                      />
                    </span>
                    <span
                      aria-hidden
                      className="relative inline-block w-0 align-baseline"
                      style={{ height: mark.capHeight }}
                    >
                      <span
                        className="absolute top-0 h-full bg-text-strong-950"
                        style={{
                          left: rightX,
                          width: mark.strokeWidth,
                          opacity: markOpacity,
                        }}
                      />
                    </span>
                  </>
                )}
                {/* Always rendered at full width, opacity-only: the right
                    mark's open position is this text's own ink edge, so the
                    name has to be laid out even while it's invisible. */}
                <span
                  ref={nameRef}
                  className="text-text-strong-950"
                  style={{ opacity: nameOpacity }}
                >
                  {FULL_NAME}
                </span>
              </span>
              <span
                className={`whitespace-nowrap text-[18px] font-medium text-text-strong-950 transition-opacity duration-300 md:hidden ${
                  progress >= 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                {FULL_NAME}
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
                    asChild={!item.panel}
                    variant="neutral"
                    mode="ghost"
                    size="xs"
                    className="text-[17px] font-normal"
                    {...(item.panel
                      ? { onClick: () => setPanel(item.panel!) }
                      : {})}
                  >
                    {item.panel ? item.label : <a href={item.href}>{item.label}</a>}
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
                    {NAV.map((item) =>
                      item.panel ? (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setPanel(item.panel!);
                          }}
                          className="block w-full px-4 py-2.5 text-left text-[15px] text-text-sub-600 hover:bg-card"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-2.5 text-[15px] text-text-sub-600 hover:bg-card"
                        >
                          {item.label}
                        </a>
                      ),
                    )}
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

      {/* Portals to <body>, so the header's own stacking context doesn't
          trap it beneath the page. */}
      <ProfileDrawer open={panel === "profile"} onClose={() => setPanel(null)} />
    </header>
  );
}
