"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RESUME_FILENAME } from "@/lib/resumeExport";
import * as Button from "@/components/ui/Button";

// Static files written to public/ by scripts/build-resume.tsx.
const FORMATS = [
  { label: "PDF", file: `${RESUME_FILENAME}.pdf` },
  { label: "Markdown", file: `${RESUME_FILENAME}.md` },
];

const EXIT_MS = 180;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`motion-transform transition-transform duration-200 ease-[var(--ease-out)] ${open ? "rotate-180" : ""}`}
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * "Download resume" with a small menu of formats, on a tertiary (ghost)
 * button. The menu is the header's mobile menu — same panel, same
 * 180ms opacity/scale on --ease-out, anchored at the corner on the side the
 * trigger is aligned to, so it grows out of the trigger rather than across
 * it.
 *
 * Inline-block, so in a line box it sits on that line's baseline.
 *
 * A disclosure, not an ARIA menu: two plain download links behind an
 * expanded/collapsed button, so they keep link semantics and Tab order.
 */
export default function ResumeExport({ align = "left" }: { align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (open) {
      setRendered(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const id = setTimeout(() => setRendered(false), EXIT_MS);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      {/* Tertiary (ghost). -ml-3 pulls it back by its 12px padding, so the
          label lines up with the text above it; -my-2 takes the 8px of box
          above and below its 20px line back out of the layout, so the gaps
          to the summary and the rule stay as they were. The hover fill
          still shows the full 36px. */}
      <Button.Root
        ref={triggerRef}
        type="button"
        mode="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        className="-my-2 -ml-3 cursor-pointer gap-1 font-[family-name:var(--font-eyebrow)] text-[16px] font-normal"
      >
        Download resume
        <ChevronIcon open={open} />
      </Button.Root>
      {rendered && (
        <div
          id={menuId}
          className={`motion-transform absolute ${align === "right" ? "right-0" : "left-0"} top-full z-30 mt-1 min-w-[140px] rounded-lg border border-rule bg-background py-1 shadow-md transition-[opacity,scale] duration-[180ms] ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
          }`}
          style={{
            transitionTimingFunction: "var(--ease-out)",
            transformOrigin: align === "right" ? "top right" : "top left",
          }}
        >
          {FORMATS.map((f) => (
            <a
              key={f.file}
              href={`/${f.file}`}
              download={f.file}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[15px] text-text-sub-600 hover:bg-card"
            >
              {f.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
