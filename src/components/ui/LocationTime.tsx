"use client";

import { useEffect, useState } from "react";

function formatTime(tz?: string) {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function LocationTime() {
  const [city, setCity] = useState<string | null>(null);
  const [tz, setTz] = useState<string | undefined>(undefined);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        if (d.city && d.region_code) {
          setCity(`${d.city}, ${d.region_code}`);
        }
        if (d.timezone) setTz(d.timezone);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTime(formatTime(tz));
    const id = setInterval(() => setTime(formatTime(tz)), 1000);
    return () => clearInterval(id);
  }, [tz]);

  if (!time) return null;

  return (
    <div className="min-w-[160px] text-left font-[family-name:var(--font-eyebrow)] text-[14px] uppercase tracking-[0.12em] text-muted">
      {city && <p>{city}</p>}
      <p>{time}</p>
    </div>
  );
}
