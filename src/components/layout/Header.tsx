"use client";

import { useState, useEffect, useRef } from "react";
import { EMAIL } from "@/content/site";
import * as Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV = [
  { label: "Profile", href: "#" },
  { label: "Writing", href: "#" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-20 bg-background/70 backdrop-blur-md">
      <div className="relative border-b border-rule">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 inset-y-2 border-x border-rule"
        />
        <div className="relative px-4 py-2 leading-none">
          <div className="mx-auto flex max-w-column items-center justify-between">
            <span className="text-[17px] font-medium text-heading">
              Mukul Chakravarthi
            </span>

            <div className="flex items-center gap-1.5">
              {/* Desktop nav */}
              <nav className="hidden gap-0.5 md:flex">
                {NAV.map((item) => (
                  <Button.Root
                    key={item.label}
                    asChild
                    variant="neutral"
                    mode="ghost"
                    size="xs"
                    className="text-[17px] font-normal"
                  >
                    <a href={item.href}>{item.label}</a>
                  </Button.Root>
                ))}
              </nav>

              {/* Mobile + menu */}
              <div className="relative md:hidden" ref={menuRef}>
                <Button.Root
                  variant="neutral"
                  mode="ghost"
                  size="xs"
                  className="text-[20px] font-normal"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Menu"
                >
                  {open ? "×" : "+"}
                </Button.Root>
                {open && (
                  <div className="absolute right-0 top-full z-30 mt-1 min-w-[140px] rounded-lg border border-rule bg-background py-1 shadow-md">
                    {NAV.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 text-[15px] text-body hover:bg-card"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme toggle — inline on mobile, hidden on desktop */}
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Theme toggle — outer stroke position on desktop only */}
          <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
