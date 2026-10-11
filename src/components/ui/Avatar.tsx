"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Circular avatar holding a looping gradient clip.
 *
 * The source was 1108x558 and 14.7MB, which is roughly twenty times the
 * resolution this is drawn at and would have dwarfed the rest of the page.
 * It's transcoded to a 128px square — enough for a 32px avatar at 3x — and
 * ships at 48KB.
 *
 * muted and playsInline are what make autoplay permissible at all; without
 * both, iOS refuses and shows a play control over the avatar. Fixed
 * dimensions rather than intrinsic sizing, so it can't shift the bio while
 * it loads.
 */
export default function Avatar() {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  // Reduced motion holds the first frame rather than dropping the avatar:
  // a looping gradient is decoration, and the preference is about movement,
  // not about hiding the image.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) el.pause();
    else void el.play().catch(() => {});
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      src="/avatar.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      className="h-8 w-8 rounded-full object-cover"
    />
  );
}
