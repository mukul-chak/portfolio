"use client";

import { useState, useEffect, useRef } from "react";
import { EMAIL } from "@/content/site";
import * as Button from "@/components/ui/Button";
import LocationTime from "@/components/ui/LocationTime";
import Avatar from "@/components/ui/Avatar";
import ProfileDrawer from "@/components/sections/ProfileDrawer";

// `panel` items open a drawer instead of navigating. Profile is the only one
// for now; Writing can take a panel id the same way once it has content.
const NAV: { label: string; href?: string; panel?: "profile" }[] = [
  { label: "Profile", panel: "profile" },
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
  const [progress, setProgress] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

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
            className="h-[20px] w-[20px] text-text-disabled-300 hover:bg-bg-weak-50 hover:text-text-soft-400"
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
            className="h-[20px] w-[20px] text-text-disabled-300 hover:bg-bg-weak-50 hover:text-text-soft-400"
          >
            <PlusIcon />
          </Button.Root>
        </div>
        <div className="relative px-4 py-2 leading-none">
          {/* Avatar and name share one spot and crossfade: the avatar holds
              the header on its own, then hands over to the full name as the
              bio title arrives (progress, driven by BodyName's scroll
              position). Both are absolute against a 32px-tall box so neither
              one shifts the other as they fade, and the box is centred in the
              header so the name's own centre lands where it did before — the
              join with the bio title is still pixel-aligned.

              Desktop and mobile are one element now. They were split only
              because the old "MC" treatment needed letter-level choreography
              that had no mobile equivalent. */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-column px-4">
              <div className="relative h-8 w-full">
                <span
                  className="absolute left-0 top-0"
                  style={{ opacity: 1 - progress }}
                >
                  <Avatar />
                </span>
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[18px] font-medium text-text-strong-950"
                  style={{ opacity: progress }}
                >
                  Mukul Chakravarthi
                </span>
              </div>
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
