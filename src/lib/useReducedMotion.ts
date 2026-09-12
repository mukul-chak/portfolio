"use client";

import { useEffect, useState } from "react";

/** Mirrors `prefers-reduced-motion: reduce` for JS-driven animation (values
 * computed per frame in script, not a CSS transition the media query alone
 * can reach — e.g. Header's scroll-linked letter spread). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    function onChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
