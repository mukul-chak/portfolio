import { EMAIL } from "@/content/site";

const NAV = [
  { label: "Profile", href: "#" },
  { label: "Writing", href: "#" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

/**
 * Sticky, full-width nav bar. Translucent + backdrop blur so content blurs as
 * it passes underneath. Its bottom border IS the divider (full width). The two
 * outer strokes are short — the nav's own height, padded 12px above and below —
 * and do not continue into the content frame below.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/70 pt-6 backdrop-blur-md">
      <div className="relative border-b border-rule pb-4">
        {/* Two outer strokes, padded 12px from the nav's top and bottom. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-3 bottom-3 border-x border-rule"
        />
        <div className="flex items-baseline justify-between px-3 leading-none">
          <span className="text-[15px] font-bold text-heading sm:text-[17px]">
            Mukul Chakravarthi
          </span>
          <nav className="flex gap-4 text-[13px] text-muted sm:gap-8 sm:text-[15px]">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-sm transition-colors hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
