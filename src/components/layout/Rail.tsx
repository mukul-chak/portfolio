import { type ReactNode } from "react";

/**
 * Column-width content rail. Draws the inner vertical rules via border-x, and
 * the rules end exactly where the rail's content ends. Stack rails adjacently
 * (no gap) for continuous rules; a gap — e.g. a filmstrip — breaks them.
 * Text is inset 16px from the rules.
 */
export default function Rail({
  children,
  className = "",
  elevateRule = false,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Draws the dotted rule as its own layer above the page's scroll fades
   * instead of baking it into this element's background — so the rule stays
   * fully opaque regardless of scroll while the content below still fades.
   */
  elevateRule?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto max-w-column px-4 ${elevateRule ? "" : "md:rule-x"} ${className}`}
    >
      {elevateRule && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[15] hidden rule-x md:block"
        />
      )}
      {children}
    </div>
  );
}
