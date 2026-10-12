"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PREVIEW_CAPTIONS, type PreviewKey } from "@/content/previews";

// The hovered link's baseline, as an offset from its box top. An inline
// element's box is its font's content area — line-height doesn't enter into
// it — so the baseline sits exactly one ascent below the top. Measured on a
// canvas in the link's own font: the computed family resolves to the loaded
// face, where `var(--font-reform)` (what this used to pass) can't be read by
// canvas and silently measured a fallback font. That, plus a half-leading
// term that doesn't apply to an inline box, left the panel 1.85px under the
// baseline in the bio and 4px above it on the resume's leading-none titles.
function measureAscent(cs: CSSStyleDeclaration) {
  const fontSizePx = parseFloat(cs.fontSize);
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fontSizePx * 0.8;
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSizePx}px ${cs.fontFamily}`;
  return ctx.measureText("Ag").fontBoundingBoxAscent ?? fontSizePx * 0.8;
}

type ActivePreview = {
  key: PreviewKey;
  top: number;
  left: number;
  width: number;
  strokeWidth: number;
};

const PREVIEW_EXIT_MS = 180;

/**
 * Hover preview for an org name: a panel in the right channel, top on the
 * hovered line's baseline, with the rest of the page dimmed behind it.
 * Shared by the bio's inline links and the resume's titles.
 *
 * `order` is the order the keys appear in the caller's copy — it drives
 * the numbered prefix on the caption, matching Filmstrip's "01  Caption".
 */
export function useHoverPreview(order: readonly PreviewKey[]) {
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

  // Portaled into a plain sibling anchor (not a descendant of the caller) —
  // Bio's own section reliably triggers a page-wide layout shift when an
  // absolutely-positioned child inside it overflows its bottom edge, so this
  // sidesteps that entirely. `position: absolute` (not `fixed`), so it scrolls
  // naturally with the anchor with no scroll-tracking needed.
  //
  // The panel does NOT draw any part of the rail's dotted rule itself — the
  // rails beside it already carry the rule. A preview that runs past its
  // section's bottom is simply running alongside the next rail's existing
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

  function show(key: PreviewKey) {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      // Guard against touch: a tap fires a synthetic mouseenter too, which
      // would otherwise populate the anchor and trigger the page-wide
      // spotlight scrim (globals.css) with no preview panel visible to
      // explain it (the panel itself is hidden below md).
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const anchor = document.getElementById("bio-preview-anchor");
      const frame = document.querySelector<HTMLElement>(".max-w-frame");
      if (!anchor || !frame) return;

      const linkRect = e.currentTarget.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();

      // The column's right edge, derived from the frame rather than read off
      // an enclosing Rail: every column is the 620px track centred in the
      // frame's content box, and the resume's Education column is a grid
      // area with no element of its own to measure.
      const frameCs = getComputedStyle(frame);
      const contentLeft = frameRect.left + parseFloat(frameCs.paddingLeft);
      const contentWidth =
        frameRect.width - parseFloat(frameCs.paddingLeft) - parseFloat(frameCs.paddingRight);
      const columnWidth = Math.min(parseFloat(frameCs.getPropertyValue("--container-column")) || 620, contentWidth);
      const columnRight = contentLeft + (contentWidth + columnWidth) / 2;

      const top = linkRect.top - anchorRect.top + measureAscent(getComputedStyle(e.currentTarget));
      const marginSpace = frameRect.right - columnRight;
      const width = (marginSpace * 2) / 3;
      const left = columnRight - anchorRect.left + 16;

      // The hugging strokes run the FULL margin space, touching the rail's
      // right vertical rule and the frame's outer vertical rule exactly (0px
      // gap on both sides) — wider than the panel itself (16px inset). Since
      // both edges share the same rail/frame boundary, the stroke's offset
      // relative to the panel reduces to a constant -16px.
      const strokeWidth = marginSpace;

      setActive({ key, top, left, width, strokeWidth });
    };
  }

  function hide() {
    setActive(null);
  }

  /** Lifts the hovered link above the page scrim while its panel shows. */
  function raised(key: PreviewKey) {
    return rendered?.key === key ? "relative z-[45]" : "";
  }

  const anchor = mounted ? document.getElementById("bio-preview-anchor") : null;

  const panel: ReactNode =
    anchor && rendered
      ? createPortal(
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
                edge-to-edge, touching the rail's and frame's vertical rules
                on either side (see strokeWidth above). */}
            <div
              className="absolute bottom-full mb-3 border-b border-rule"
              style={{ left: -16, width: rendered.strokeWidth }}
            />
            <span className="mb-2 block font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] tabular-nums text-text-sub-600">
              {String(order.indexOf(rendered.key) + 1).padStart(2, "0")}
            </span>
            <div className="aspect-[1.6] w-full rounded-[4px] bg-card" />
            <p className="mt-2 line-clamp-3 font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] text-text-sub-600">
              {PREVIEW_CAPTIONS[rendered.key]}
            </p>
            <div
              className="absolute top-full mt-3 border-b border-rule"
              style={{ left: -16, width: rendered.strokeWidth }}
            />
          </div>,
          anchor,
        )
      : null;

  return { show, hide, raised, panel };
}
