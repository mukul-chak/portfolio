"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Circular avatar: a brushed steel sphere on a transparent background,
 * turning on a seamless 6s loop at normal speed.
 *
 * Rendered in Blender as 180 512px RGBA frames, encoded twice at 128px —
 * enough for 32px at 3x — because no one format carries alpha everywhere:
 * HEVC with alpha (~45KB) for Safari, VP9 with alpha in WebM (~29KB) for
 * Chrome and Firefox. The HEVC source comes first: Safari plays WebM too
 * but drops its alpha, and Chrome and Firefox can't play the QuickTime
 * container at all, so each browser falls through to the one it renders
 * with transparency.
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
  // the loop is decoration, and the preference is about movement, not
  // about hiding the image.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) el.pause();
    else void el.play().catch(() => {});
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      className="h-8 w-8 rounded-full object-cover"
    >
      <source src="/avatar-steel-hevc.mov" type='video/quicktime; codecs="hvc1"' />
      <source src="/avatar-steel.webm" type="video/webm" />
    </video>
  );
}
