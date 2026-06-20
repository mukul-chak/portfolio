import { type ReactNode } from "react";

/**
 * Column-width content rail. Draws the inner vertical rules via border-x, and
 * the rules end exactly where the rail's content ends. Stack rails adjacently
 * (no gap) for continuous rules; a gap — e.g. a filmstrip — breaks them.
 * Text is inset 12px from the rules.
 */
export default function Rail({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-column border-rule px-3 md:border-x ${className}`}
    >
      {children}
    </div>
  );
}
