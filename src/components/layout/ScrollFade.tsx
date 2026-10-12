"use client";

import { useEffect, useState } from "react";

/**
 * The always-on bottom scroll fade. It says "there's more below", which
 * stops being true once the footer is in view — and left on, it sat over
 * the footer at full scroll, fading its last lines out and painting the
 * page background over the footer's own tint.
 *
 * An IntersectionObserver rather than a scroll listener: it only fires on
 * the crossing, and doesn't depend on rAF, which the preview pane throttles.
 */
export default function ScrollFade() {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) =>
      setAtEnd(entry.isIntersecting),
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[16] h-32 bg-gradient-to-t from-background from-20% to-transparent transition-opacity duration-200 ease-[var(--ease-out)] ${
        atEnd ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
