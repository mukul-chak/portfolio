"use client";

import { useEffect, useState } from "react";

export default function TopScrim() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[9] h-28 bg-gradient-to-b from-background from-30% to-transparent transition-opacity duration-500 ease-[var(--ease-out)] ${
        scrolled ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
