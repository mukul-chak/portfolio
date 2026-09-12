"use client";

import { useState, useEffect, useRef } from "react";
import { EMAIL } from "@/content/site";
import * as Button from "@/components/ui/Button";
import LocationTime from "@/components/ui/LocationTime";

const NAV = [
  { label: "Profile", href: "#" },
  { label: "Writing", href: "#" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

export default function Header({
  city,
  tz,
}: {
  city?: string;
  tz?: string;
}) {
  const [open, setOpen] = useState(false);
  const [nameScrolled, setNameScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onNameScroll(e: Event) {
      setNameScrolled((e as CustomEvent<boolean>).detail);
    }
    window.addEventListener("name-scrolled", onNameScroll);
    return () => window.removeEventListener("name-scrolled", onNameScroll);
  }, []);

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
          {/* Name: absolute overlay, crossfades in when body name scrolls out */}
          <div
            className={`pointer-events-none absolute inset-0 flex items-center transition-opacity duration-300 ${
              nameScrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="mx-auto w-full max-w-column px-3">
              <span className="whitespace-nowrap text-[17px] font-medium text-text-strong-950">
                Mukul Chakravarthi
              </span>
            </div>
          </div>

          {/* Nav items: right-aligned, name is not in flex flow */}
          <div className="mx-auto flex max-w-column items-center justify-end">
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
                        className="block px-4 py-2.5 text-[15px] text-text-sub-600 hover:bg-card"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location/time — outer stroke position on desktop only */}
          <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block">
            <LocationTime city={city} tz={tz} />
          </div>
        </div>
      </div>
    </header>
  );
}
