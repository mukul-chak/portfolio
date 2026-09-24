"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Emil Kowalski's drawer recipe: 500ms on --ease-drawer (the iOS/Ionic curve
// Vaul uses). Shared by the slide, the scrim fade, and the unmount delay, so
// the panel finishes leaving before it's removed from the DOM.
const TRANSITION_MS = 500;

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 3l8 8M11 3l-8 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Right-side overlay drawer: fixed header (title + close) with a stroke above
 * and below it, and a scrollable body beneath. Portaled to <body>, so the
 * header's own stacking context doesn't trap it.
 *
 * Content-agnostic — Profile is the first use; pass any children.
 */
export default function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Mount on open; on close, stay mounted for one transition so the exit
  // actually plays.
  useEffect(() => {
    if (open) {
      setRendered(true);
      return;
    }
    setVisible(false);
    const id = setTimeout(() => setRendered(false), TRANSITION_MS);
    return () => clearTimeout(id);
  }, [open]);

  // Then, once the closed state is actually in the DOM, flip it open.
  //
  // This is deliberately a separate effect keyed on `rendered`, not a
  // requestAnimationFrame inside the one above: scheduling the flip in the
  // same effect that mounts starts the frame countdown BEFORE React has
  // committed the panel, so the callback can land in the same commit as the
  // mount. The panel then renders straight to its open position, the browser
  // never paints an offscreen state to transition from, and the drawer just
  // appears. That raced — it animated under some timings and not others.
  //
  // Reading a layout property first forces the browser to compute the closed
  // transform, so the flip is a change from a known previous value rather
  // than the element's first painted style.
  useEffect(() => {
    if (!rendered || !open) return;
    const panel = panelRef.current;
    if (panel) void panel.getBoundingClientRect();
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [rendered, open]);

  // Scroll-lock the page behind, compensating for the scrollbar's width so
  // the page doesn't shift sideways as its scrollbar disappears. Set on both
  // <html> and <body>: which one is the viewport scroller depends on the
  // document's own overflow, and body-only relies on a propagation rule that
  // silently stops applying if <html> ever gets a non-visible overflow.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const barWidth = window.innerWidth - documentElement.clientWidth;
    const prev = {
      htmlOverflow: documentElement.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (barWidth > 0) body.style.paddingRight = `${barWidth}px`;
    return () => {
      documentElement.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
    };
  }, [open]);

  // Escape closes; Tab cycles within the panel. aria-modal alone doesn't stop
  // focus walking out into the page behind, so the trap is explicit.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Focus moves in on open and back to whatever opened it on close.
  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      const id = requestAnimationFrame(() => closeRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  }, [open]);

  if (!mounted || !rendered) return null;

  return createPortal(
    // z-50: above everything else on the page, including the hover-preview
    // spotlight scrim (z-40) and its panel (z-[45]).
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden
        onClick={onClose}
        // Same duration and curve as the panel, so the two read as one
        // surface arriving rather than two things moving independently.
        className={`absolute inset-0 bg-background transition-opacity duration-[500ms] ease-[var(--ease-drawer)] ${
          visible ? "opacity-60" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`motion-transform absolute inset-y-0 right-0 flex w-full flex-col border-l border-rule bg-background transition-transform duration-[500ms] ease-[var(--ease-drawer)] md:w-[62%] md:max-w-[620px] ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Fixed header: 16px down from the top of the screen, then stroke,
            4px, title row, 4px, stroke. The close button is the tallest
            thing in the row, so the row's own edges are the button's and
            the 4px gaps are measured from it. */}
        <div className="shrink-0 px-4 pt-4">
          <div className="border-t border-rule" />
          <div className="flex items-center justify-between py-[4px]">
            <h2 className="text-[16px] text-text-strong-950">{title}</h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={`Close ${title}`}
              className="-mr-2 flex h-8 w-8 items-center justify-center rounded-[4px] text-text-soft-400 transition-colors duration-100 ease-out hover:bg-bg-weak-50 hover:text-text-strong-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-strong-950"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="border-b border-rule" />
        </div>

        {/* Only this scrolls; the header above stays put. */}
        <div className="flex-1 overflow-y-auto px-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
