"use client";

import { useEffect, useState } from "react";

export default function BottomScrim() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      // 16vh from 27.5, and the solid band dropped from 40% to 0. The old
      // shape held a fully opaque fifth of the viewport at the bottom, which
      // is fine behind a carousel but swallowed the collapsed Recent work
      // bar whole — the one case where real, readable content sits at the
      // very bottom of a short page. The fade still reads; nothing under it
      // is now fully hidden.
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[16] h-[16vh] bg-gradient-to-t from-background from-0% to-transparent transition-opacity duration-700 ease-[var(--ease-out)] ${
        scrolled ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
