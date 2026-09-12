"use client";

import { useEffect, useState } from "react";

function formatTime(tz?: string) {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function LocationTime({
  city,
  tz,
}: {
  city?: string;
  tz?: string;
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
    setTime(formatTime(resolvedTz));
    const id = setInterval(() => setTime(formatTime(resolvedTz)), 1000);
    return () => clearInterval(id);
  }, [resolvedTz]);

  if (!time) return null;

  return (
    <div className="whitespace-nowrap text-right font-[family-name:var(--font-eyebrow)] text-[14px] uppercase tracking-[0.12em] text-muted">
      {resolvedCity ? `${resolvedCity}, ${time}` : time}
    </div>
  );
}
