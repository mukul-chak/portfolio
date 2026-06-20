import { EMAIL } from "@/content/site";
import * as Button from "@/components/ui/Button";

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
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md">
      <div className="relative border-b border-rule">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 inset-y-2 border-x border-rule"
        />
        <div className="mx-auto flex max-w-column items-center justify-between px-4 py-2 leading-none">
          <span className="text-[17px] font-medium text-heading">
            Mukul Chakravarthi
          </span>
          <nav className="flex gap-0.5">
            {NAV.map((item) => (
              <Button.Root key={item.label} asChild variant="neutral" mode="ghost" size="xs" className="text-[17px] font-normal">
                <a href={item.href}>{item.label}</a>
              </Button.Root>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
