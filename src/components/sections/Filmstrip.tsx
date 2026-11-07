"use client";

import { useEffect, useRef, useState } from "react";
import { useDragScroll } from "@/lib/useDragScroll";
import { useReducedMotion } from "@/lib/useReducedMotion";
import Tabular from "@/components/ui/Tabular";
import * as DotStepper from "@/components/ui/DotStepper";
import type { WorkMedia } from "@/content/workMedia";

const CARD_MEDIA = "aspect-[1.6] w-full rounded-[4px] bg-card object-cover max-sm:rounded-none";

/**
 * A card's video: muted, looping, inline. Plays only while at least half of
 * it is on screen, so a page of carousels isn't decoding every clip at
 * once; under reduced motion it never plays and shows its first frame.
 */
function CardVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reducedMotion) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      // #t=0.001 makes Safari paint the first frame before playback.
      src={`${src}#t=0.001`}
      muted
      loop
      playsInline
      preload="metadata"
      className={CARD_MEDIA}
    />
  );
}

/**
 * A divider across the frame. Rule crossings carry no marks anywhere on
 * the page.
 *
 * -mx-4 cancels Filmstrip's own padding so the line reaches the outer frame
 * rule instead of stopping 16px short of it on each side — the cards are what
 * the padding is for, not the rules.
 */
function Divider({
  className = "",
  ...rest
}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative -mx-4 ${className}`} {...rest}>
      <div className="border-b border-rule" />
    </div>
  );
}

/**
 * Horizontal image filmstrip. A plain overflow-x container (no scrollbar) clips
 * cards at its right edge, inset 16px from the outer rules. Mouse drag-to-pan
 * via useDragScroll; touch/trackpad scroll natively. Up to 6 cards.
 *
 * Each card carries a single-line caption below it (index + text, truncated),
 * so caption and image travel together through the horizontal scroll.
 */
export default function Filmstrip({
  count = 6,
  captions,
  media = [],
}: {
  count?: number;
  captions?: string[];
  /** Real files, in order. When there are any, they set the card count. */
  media?: WorkMedia[];
}) {
  const drag = useDragScroll<HTMLDivElement>();
  const cards = Array.from({ length: media.length || count }, (_, i) => i + 1);
  const reducedMotion = useReducedMotion();
  // Phones only: which card the strip has snapped to, for the dots.
  const [active, setActive] = useState(0);

  function cardStep(row: HTMLDivElement) {
    const first = row.firstElementChild?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 16 : row.clientWidth;
  }

  function goTo(i: number) {
    const row = drag.ref.current;
    if (!row) return;
    row.scrollTo({ left: i * cardStep(row), behavior: reducedMotion ? "auto" : "smooth" });
  }
  return (
    <div className="px-4 pt-1">
      {/* Solid divider above the carousel, 8px above the images. Carries
          data-rule-divider so RecentWork's junction connector strokes can
          measure its real position at runtime instead of a hardcoded offset. */}
      <Divider data-rule-divider />
      <div
        data-carousel-row
        ref={drag.ref}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onPointerCancel={drag.onPointerCancel}
        onClickCapture={drag.onClickCapture}
        onScroll={(e) => {
          const row = e.currentTarget;
          setActive(Math.round(row.scrollLeft / cardStep(row)));
        }}
        // On phones the strip spans the gap between the page rules, one card at a time.
        className="mt-3 cursor-grab select-none overflow-x-auto active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-sm:-mx-[15px] max-sm:snap-x max-sm:snap-mandatory"
      >
        <div className="flex gap-4">
          {cards.map((n) => (
            <div key={n} className="w-full shrink-0 snap-center sm:w-[504px]">
              {media[n - 1]?.kind === "video" ? (
                <CardVideo src={media[n - 1].src} />
              ) : media[n - 1] ? (
                // eslint-disable-next-line @next/next/no-img-element -- static exports into a fixed slot; next/image would add nothing but a wrapper
                <img
                  src={media[n - 1].src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  // Not draggable: the strip pans on drag, and the browser's
                  // own image drag would take the gesture instead.
                  draggable={false}
                  className={CARD_MEDIA}
                />
              ) : (
                <div className="aspect-[1.6] rounded-[4px] bg-card max-sm:rounded-none" />
              )}
              <div className="mt-2 flex items-baseline gap-6 max-sm:hidden overflow-hidden whitespace-nowrap font-[family-name:var(--font-eyebrow)] text-[14px] leading-[18px] text-left text-text-soft-400">
                <span className="shrink-0">
                  <Tabular>{String(n).padStart(2, "0")}</Tabular>
                </span>
                <span className="truncate">
                  <Tabular>{captions?.[n - 1] ?? ""}</Tabular>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Phones show no captions; these dots say the strip swipes and
          where in it you are. */}
      <DotStepper.Root aria-label="Images" className="mt-4 sm:hidden">
        {cards.map((n, i) => (
          <DotStepper.Item
            key={n}
            active={i === active}
            className="size-1.5"
            aria-label={`Image ${n} of ${cards.length}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </DotStepper.Root>
      {/* Solid divider between projects (not the dotted rule), optically
          24px below the captions: their baseline sits 4.5px inside the 18px
          line box, so 19.5px of margin puts the line 24px under it. The
          next title sits 32px below it (RecentWork). data-rule-divider-close
          lets the NEXT project's connector reach backward and bridge its own
          rule-x up to this line, closing the gap from below. */}
      <Divider data-rule-divider-close className="mt-6 sm:mt-[19.5px]" />
    </div>
  );
}
