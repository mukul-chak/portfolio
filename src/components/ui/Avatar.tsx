"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Inverted on purpose: the pale dusk clip plays by day, the bluer dawn
// clip by night.
const DAY_CLIP = "/avatar-dusk.mp4";
const NIGHT_CLIP = "/avatar-dawn.mp4";

// Day from 6:00am through 6:00pm, night from 6:01pm through 5:59am, by the
// visitor's own clock — not the theme, and not the IP-derived time the
// header shows.
// Both clips drift slowly: over 5s, dawn's pixels move ~4/255 on average
// and dusk's ~1/255, against ~29 for the old avatar. Played faster so the
// motion reads at 32px. Tunable; the loop stays seamless at any rate.
const PLAYBACK_RATE = 3;

const DAY_START = 6 * 60;
const DAY_END = 18 * 60;

function minutesOf(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

function clipFor(d: Date) {
  const m = minutesOf(d);
  return m >= DAY_START && m <= DAY_END ? DAY_CLIP : NIGHT_CLIP;
}

/** Milliseconds until the clip next changes: 6:01pm, or 6:00am. */
function msToNextSwitch(d: Date) {
  const next = new Date(d);
  next.setSeconds(0, 0);
  const m = minutesOf(d);
  if (m >= DAY_START && m <= DAY_END) next.setHours(18, 1);
  else {
    if (m > DAY_END) next.setDate(next.getDate() + 1);
    next.setHours(6, 0);
  }
  return next.getTime() - d.getTime();
}

/**
 * Circular avatar holding a looping gradient clip — one by day, another
 * by night.
 *
 * The sources are 1890x1576 and ~23MB each, hundreds of times what a 32px
 * circle needs. Each is centre-cropped and transcoded to a 128px square —
 * enough for 32px at 3x — and ships at ~22KB (dawn) and ~17KB (dusk).
 *
 * The clip is chosen on the client: the server can't know the visitor's
 * clock, so the first render has no src (server and client agree, nothing
 * to correct) and only the chosen clip is ever fetched. A timer swaps it at
 * the boundary for anyone with the page open across 6pm or 6am, and a
 * return to the tab re-checks, since background timers can fire late.
 *
 * muted and playsInline are what make autoplay permissible at all; without
 * both, iOS refuses and shows a play control over the avatar. Fixed
 * dimensions rather than intrinsic sizing, so it can't shift the bio while
 * it loads.
 */
export default function Avatar() {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function update() {
      const now = new Date();
      setSrc(clipFor(now));
      clearTimeout(timer);
      timer = setTimeout(update, msToNextSwitch(now));
    }
    function onVisible() {
      if (document.visibilityState === "visible") update();
    }
    update();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Reduced motion holds the first frame rather than dropping the avatar:
  // a looping gradient is decoration, and the preference is about movement,
  // not about hiding the image.
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    // defaultPlaybackRate survives a src swap; playbackRate is the live one.
    el.defaultPlaybackRate = PLAYBACK_RATE;
    el.playbackRate = PLAYBACK_RATE;
    if (reducedMotion) el.pause();
    else void el.play().catch(() => {});
  }, [reducedMotion, src]);

  return (
    <video
      ref={ref}
      src={src ?? undefined}
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
