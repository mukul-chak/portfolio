"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

function formatTime(tz?: string, seconds = false) {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    // The footer's clock is a 24-hour digital readout (13:05:09); the
    // header keeps 12-hour with AM/PM.
    ...(seconds
      ? { second: "2-digit" as const, hourCycle: "h23" as const }
      : { hour12: true }),
  });
  if (!seconds) return time;
  // The footer's clock: date and time, no city. Same zone as the time.
  const date = now.toLocaleDateString("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${date}, ${time}`;
}

export default function LocationTime({
  city,
  tz,
  seconds = false,
  className,
}: {
  city?: string;
  tz?: string;
  /** The mobile footer's clock: date and time with ticking seconds, and no
   *  city. */
  seconds?: boolean;
  className?: string;
}) {
  const [devCity, setDevCity] = useState<string | undefined>(undefined);
  const [devTz, setDevTz] = useState<string | undefined>(undefined);

  // Dev-only: Vercel's geo headers don't exist on localhost, so there's
  // nothing to visually verify against without this. Never runs in production —
  // the deployed site relies solely on the server-provided city/tz props above.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || city) return;
    fetch("https://ipwho.is/")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.city) {
          setDevCity(d.city);
        }
        if (d.timezone?.id) setDevTz(d.timezone.id);
      })
      .catch(() => {});
  }, [city]);

  const resolvedCity = city ?? devCity;
  // Falls back to the viewer's own device timezone when there's no
  // server- or dev-fallback-provided one.
  const resolvedTz =
    tz ?? devTz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(formatTime(resolvedTz, seconds));
    const id = setInterval(() => setTime(formatTime(resolvedTz, seconds)), 1000);
    return () => clearInterval(id);
  }, [resolvedTz, seconds]);

  if (!time) return null;

  return (
    <div
      className={cn(
        "whitespace-nowrap text-right font-[family-name:var(--font-eyebrow)] text-[13px] uppercase tracking-[0.12em] text-text-sub-600",
        // Tabular so a ticking seconds field doesn't shift the line.
        seconds && "tabular-nums",
        className,
      )}
    >
      {resolvedCity && !seconds ? `${resolvedCity}, ${time}` : time}
    </div>
  );
}
