"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import InlineLink from "@/components/ui/InlineLink";
import Kbd from "@/components/ui/Kbd";
import { EMAIL } from "@/content/site";

const PREVIEW_CAPTIONS: Record<string, string> = {
  ascend:
    "Ascend is a Financial Operations and Accounting Platform transforming how money moves in insurance.",
  // TODO: replace with real copy.
  saag: "SAAG is a design and strategy studio advising on next-gen product experiences.",
};

// Font metrics (measured once) used to find each hovered line's true text
// baseline within its line box, rather than the line box's own top/bottom.
function measureBaselineFromTop(fontSizePx: number, lineHeightPx: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return lineHeightPx / 2;
  ctx.font = `${fontSizePx}px var(--font-reform), sans-serif`;
  const m = ctx.measureText("Ag");
  const ascent = m.fontBoundingBoxAscent ?? fontSizePx * 0.8;
  const descent = m.fontBoundingBoxDescent ?? fontSizePx * 0.2;
  const halfLeading = (lineHeightPx - (ascent + descent)) / 2;
  return halfLeading + ascent;
}

type ActivePreview = {
  key: string;
  top: number;
  left: number;
  width: number;
  strokeWidth: number;
};

const PREVIEW_EXIT_MS = 180;

export default function Bio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ActivePreview | null>(null);
  // `rendered` lags `active` on the way out only, so the panel can play an
  // exit fade instead of unmounting the instant the pointer leaves. `visible`
  // is the actual opacity/scale toggle — set a frame after mount so the
  // entrance transition has a starting value to animate from.
  const [rendered, setRendered] = useState<ActivePreview | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (active) {
      setRendered(active);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const id = setTimeout(() => setRendered(null), PREVIEW_EXIT_MS);
    return () => clearTimeout(id);
  }, [active]);

  // Portaled into a plain sibling anchor (not a descendant of this section) —
  // Bio's own section reliably triggers a page-wide layout shift when an
  // absolutely-positioned child inside it overflows its bottom edge, so this
  // sidesteps that entirely. `position: absolute` (not `fixed`), so it scrolls
  // naturally with the anchor with no scroll-tracking needed.
  //
  // Bio does NOT draw any part of the rail's dotted rule itself — Rail's own
  // elevateRule overlay already covers Bio's natural height, and RecentWork's
  // first rail begins immediately (zero gap) where Bio's ends and continues
  // the same rule on its own. A hover preview that runs past Bio's natural
  // bottom is simply running alongside that next rail's already-existing
  // rule — adding a second independently-positioned "bridge" stroke there
  // only doubles up against it (this was tried and visibly misaligned).
  useEffect(() => {
    if (!active) return;
    function onScroll() {
      setActive(null);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  function showPreview(key: string) {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      // Guard against touch: a tap fires a synthetic mouseenter too, which
      // would otherwise populate the anchor and trigger the page-wide
      // spotlight scrim (globals.css) with no preview panel visible to
      // explain it (the panel itself is hidden below md).
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const anchor = document.getElementById("bio-preview-anchor");
      const frame = document.querySelector(".max-w-frame");
      const rail = sectionRef.current?.closest(".max-w-column");
      if (!anchor || !frame || !rail) return;

      const linkRect = e.currentTarget.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();

      const cs = getComputedStyle(e.currentTarget);
      const fontSizePx = parseFloat(cs.fontSize);
      const lineHeightPx = parseFloat(cs.lineHeight) || fontSizePx * 1.2;
      const baselineFromTop = measureBaselineFromTop(fontSizePx, lineHeightPx);

      const top = linkRect.top - anchorRect.top + baselineFromTop;
      const marginSpace = frameRect.right - railRect.right;
      const width = (marginSpace * 2) / 3;
      const left = railRect.right - anchorRect.left + 16;

      // The hugging strokes run edge-to-edge of the margin space (4px inset
      // from the vertical rule on both sides), wider than the panel itself
      // (16px inset). Since both insets share the same rail/frame edges, the
      // stroke's offset relative to the panel reduces to a constant -12px.
      const strokeWidth = marginSpace - 8;

      setActive({ key, top, left, width, strokeWidth });
    };
  }

  function hidePreview() {
    setActive(null);
  }

  const preview = rendered ? PREVIEW_CAPTIONS[rendered.key] : null;
  const anchor = typeof document !== "undefined" ? document.getElementById("bio-preview-anchor") : null;

  return (
    <section
      ref={sectionRef}
      className="relative mt-4 space-y-6 text-[18px] leading-[1.65] text-text-sub-600"
    >
      <p>
        An art-director-turned-product designer with a knack for turning
        paper-napkin ideas into scalable digital products.
      </p>
      <p>
        I currently lead product design for{" "}
        <InlineLink
          href="https://www.useascend.com"
          external
          onMouseEnter={showPreview("ascend")}
          onMouseLeave={hidePreview}
          className={rendered?.key === "ascend" ? "relative z-[45]" : ""}
        >
          Ascend
        </InlineLink>
        , a financial operations platform built for insurance, where I've driven
        and evolved the core platform experience over the last 8 years. I'm also
        a design director and advisor at{" "}
        <InlineLink
          href="#"
          onMouseEnter={showPreview("saag")}
          onMouseLeave={hidePreview}
          className={rendered?.key === "saag" ? "relative z-[45]" : ""}
        >
          SAAG
        </InlineLink>{" "}
        where I advise on product strategy and craft next-gen product experiences.
      </p>
      <p>
        Press <Kbd>c</Kbd> to copy my email or{" "}
        <InlineLink href={`mailto:${EMAIL}`}>write to me</InlineLink>.
      </p>

      {mounted &&
        anchor &&
        rendered &&
        preview &&
        createPortal(
          <div
            aria-hidden
            className={`motion-transform pointer-events-none absolute z-[45] hidden md:block transition-[opacity,transform] duration-[180ms] ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            }`}
            style={{
              left: rendered.left,
              top: rendered.top,
              width: rendered.width,
              transitionTimingFunction: "var(--ease-out)",
              transformOrigin: "top left",
            }}
          >
            {/* Solid strokes hugging the panel, 12px above/below — same style
                as the outer frame's solid stroke (border-rule) — and running
                to 4px from the vertical rule on either side, wider than the
                panel itself (see strokeWidth above). */}
            <div
              className="absolute bottom-full mb-3 border-b border-rule"
              style={{ left: -12, width: rendered.strokeWidth }}
            />
            <div className="aspect-[1.6] w-full rounded-[4px] bg-card" />
            <p className="mt-2 line-clamp-3 font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] text-text-sub-600">
              {preview}
            </p>
            <div
              className="absolute top-full mt-3 border-b border-rule"
              style={{ left: -12, width: rendered.strokeWidth }}
            />
          </div>,
          anchor,
        )}
    </section>
  );
}
