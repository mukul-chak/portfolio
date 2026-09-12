"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="1.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 12.5h5M7 9.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3.4 3.4l.7.7M9.9 9.9l.7.7M10.6 3.4l-.7.7M4.1 9.9l-.7.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M11.5 9A5 5 0 015 2.5h-.01A5 5 0 1011.5 9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

const OPTIONS = [
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "light",  label: "Light",  Icon: SunIcon },
  { value: "dark",   label: "Dark",   Icon: MoonIcon },
] as const;

export default function ThemeToggle({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={[
        "flex items-center rounded-full bg-bg-weak-50 p-1 gap-0.5",
        orientation === "vertical" ? "flex-col" : "flex-row",
      ].join(" ")}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={label}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-100",
              active
                ? "bg-bg-white-0 text-text-strong-950 shadow-xs"
                : "text-text-soft-400 hover:text-text-sub-600",
            ].join(" ")}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
