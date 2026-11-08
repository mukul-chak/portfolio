"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

export default function BackToTop({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })}
      className={`flex h-11 items-center gap-1.5 text-[16px] text-text-sub-600 transition-colors duration-100 ease-out hover:text-text-strong-950 ${className}`}
    >
      Back to top
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
