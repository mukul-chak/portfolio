"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PREVIEW_CAPTIONS, PREVIEW_NOTES, PREVIEW_SITES, PREVIEW_VIDEOS, type PreviewKey } from "@/content/previews";
import { useReducedMotion } from "@/lib/useReducedMotion";

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

/**
 * The right channel's two edges, in viewport x: the column's right rule and
 * the frame's outer rule. Derived from the frame rather than read off an
 * enclosing Rail: every column is the 620px track centred in the frame's
 * content box, and the resume's Education column is a grid area with no
 * element of its own to measure.
 */
function channelEdges() {
  const frame = document.querySelector<HTMLElement>(".max-w-frame");
  if (!frame) return null;
  const frameRect = frame.getBoundingClientRect();
  const frameCs = getComputedStyle(frame);
  const contentLeft = frameRect.left + parseFloat(frameCs.paddingLeft);
  const contentWidth =
    frameRect.width - parseFloat(frameCs.paddingLeft) - parseFloat(frameCs.paddingRight);
  const columnWidth = Math.min(parseFloat(frameCs.getPropertyValue("--container-column")) || 620, contentWidth);
  return {
    frameRect,
    columnRight: contentLeft + (contentWidth + columnWidth) / 2,
    frameRight: contentLeft + contentWidth,
  };
}

/**
 * Lights the right channel while a note is open: its two dotted lines stay
 * at full strength above the page scrim, so the whole channel reads as
 * active, not just the panel.
 *
 * These are the real lines, so the dash rhythm is exact. A wide rule-x
 * element (a Rail's overlay, Education's, the fixed outer frame rule) paints
 * both edges of its box, so it can't simply be lifted — its left edge would
 * light too. It gets a temporary copy instead: same element, same place,
 * same pattern, lifted and clipped to its right-edge pixel, while the
 * original stays dimmed underneath. A 1px connector on that x is lifted as
 * is. The header's own strokes are skipped: the sticky header is its own
 * stacking context below the scrim, so nothing inside it can rise above.
 * Returns the undo.
 */
function lightChannel() {
  const edges = channelEdges();
  if (!edges) return () => {};
  const near = (a: number, b: number) => Math.abs(a - b) < 1.5;
  const added: HTMLElement[] = [];
  const lifted: HTMLElement[] = [];
  for (const el of document.querySelectorAll<HTMLElement>(".rule-x")) {
    if (el.closest("header") || el.dataset.channelLit) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (!near(r.right, edges.columnRight) && !near(r.right, edges.frameRight)) continue;
    if (r.width <= 2) {
      el.dataset.channelLit = "line";
      lifted.push(el);
      continue;
    }
    // The outer rule sits inside a fixed wrapper that carries its z-index,
    // so the copy is of that wrapper.
    const host = el.closest<HTMLElement>(".fixed") ?? el;
    const copy = host.cloneNode(true) as HTMLElement;
    copy.dataset.channelLit = "copy";
    copy.setAttribute("aria-hidden", "true");
    const rule = copy.matches(".rule-x") ? copy : copy.querySelector<HTMLElement>(".rule-x");
    if (rule) rule.dataset.channelLitEdge = "";
    host.after(copy);
    added.push(copy);
  }
  return () => {
    added.forEach((n) => n.remove());
    lifted.forEach((n) => delete n.dataset.channelLit);
  };
}

type ActivePreview = {
  key: PreviewKey;
  top: number;
  left: number;
  width: number;
  strokeWidth: number;
  /** The footer's top edge, anchor-relative — the lowest the panel's
   *  bottom stroke may reach. */
  maxBottom: number;
};

const PREVIEW_EXIT_MS = 180;

// The bottom stroke hangs below the panel: mt-3 (12px) plus its 1px border.
const STROKE_BELOW = 12 + 1;

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
  const panelRef = useRef<HTMLDivElement>(null);
  // How far the panel is pulled up to stay clear of the footer (≤ 0).
  const [lift, setLift] = useState(0);
  const reducedMotion = useReducedMotion();

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
    return (e: MouseEvent<HTMLElement>) => {
      // Guard against touch: a tap fires a synthetic mouseenter too, which
      // would otherwise populate the anchor and trigger the page-wide
      // spotlight scrim (globals.css) with no preview panel visible to
      // explain it (the panel itself is hidden below md).
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const anchor = document.getElementById("bio-preview-anchor");
      const edges = channelEdges();
      if (!anchor || !edges) return;
      const { frameRect, columnRight } = edges;

      const linkRect = e.currentTarget.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

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

      // The panel stops at the end of the body: near the footer (a title at
      // the bottom of the resume, a short viewport) it's pulled up until its
      // bottom stroke lands on the footer's top edge, rather than running
      // into the band. Only the limit is known here — the panel's height
      // depends on its width and caption, so it's measured once rendered.
      const footer = document.querySelector("footer");
      const maxBottom = footer
        ? footer.getBoundingClientRect().top - anchorRect.top
        : Number.POSITIVE_INFINITY;

      setActive({ key, top, left, width, strokeWidth, maxBottom });
    };
  }

  // Measured before paint, so a lifted panel never shows at its unlifted
  // position first. The computed height, not offsetHeight or the rect: it
  // ignores the entrance scale (the rect doesn't) and keeps the fraction
  // (offsetHeight rounds — 199 for a 198.84px panel, which left the stroke
  // 0.16px into the footer).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!rendered || !panel) return;
    const height = parseFloat(getComputedStyle(panel).height) || 0;
    const bottom = rendered.top + height + STROKE_BELOW;
    setLift(Math.min(0, rendered.maxBottom - bottom));
  }, [rendered]);

  // Light the channel for as long as the panel is mounted — including its
  // exit fade — so the lines dim back in step with the scrim, which is keyed
  // on the same thing (the anchor having content).
  useEffect(() => {
    if (!rendered) return;
    return lightChannel();
  }, [rendered]);

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
            ref={panelRef}
            aria-hidden
            className={`motion-transform pointer-events-none absolute z-[45] hidden md:block transition-[opacity,transform] duration-[180ms] ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            }`}
            style={{
              left: rendered.left,
              top: rendered.top + lift,
              width: rendered.width,
              transitionTimingFunction: "var(--ease-out)",
              transformOrigin: "top left",
            }}
          >
            {/* Fill: the band between the two strokes, page-coloured so
                whatever the panel crosses (an accordion's hatch, a rule-t)
                doesn't show through. It spans the channel like the strokes
                but stops 1px short of each side, so the column rule and the
                outer frame rule stay drawn — the panel sits above both
                (z-45 over z-15/z-17). -z-10 puts it under the panel's own
                content inside the panel's stacking context. */}
            <div
              className="absolute -z-10 -top-3 -bottom-3 bg-background"
              style={{ left: -15, width: rendered.strokeWidth - 2 }}
            />
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
            {/* A note is the caption alone — no image, no clamp — read as a
                margin note rather than a preview of somewhere. */}
            {/* A video, where the key has one, fills the same slot: muted,
                looping and inline, so it reads as a moving image rather than
                a player. It mounts with the panel, so each hover starts it
                from the top. Under reduced motion it doesn't play; #t=0.001
                makes Safari paint the first frame instead of a blank box. */}
            {!PREVIEW_NOTES.has(rendered.key) &&
              (PREVIEW_VIDEOS[rendered.key] ? (
                <video
                  key={rendered.key}
                  src={reducedMotion ? `${PREVIEW_VIDEOS[rendered.key]}#t=0.001` : PREVIEW_VIDEOS[rendered.key]}
                  autoPlay={!reducedMotion}
                  muted
                  loop
                  playsInline
                  preload={reducedMotion ? "metadata" : "auto"}
                  className="aspect-[1.6] w-full rounded-[4px] bg-card object-cover"
                />
              ) : (
                <div className="aspect-[1.6] w-full rounded-[4px] bg-card" />
              ))}
            <p
              className={`font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] text-text-sub-600 ${
                PREVIEW_NOTES.has(rendered.key) ? "" : "mt-2 line-clamp-3"
              }`}
            >
              {PREVIEW_CAPTIONS[rendered.key]}
            </p>
            {/* Text, not a link: the panel is pointer-events-none and closes
                as the cursor leaves the word, so it can't be clicked — the
                hovered word itself is the link. One step softer than the
                caption, so it reads as the source rather than more prose. */}
            {PREVIEW_SITES[rendered.key] && (
              <p className="mt-1 font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] text-text-soft-400">
                {PREVIEW_SITES[rendered.key]}
              </p>
            )}
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
