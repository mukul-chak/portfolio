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
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[27.5vh] bg-gradient-to-t from-background from-40% to-transparent transition-opacity duration-700 ease-[var(--ease-out)] ${
        scrolled ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
