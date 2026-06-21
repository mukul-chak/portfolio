import { type ReactNode } from "react";

/**
 * Page frame: a centered max-width container. The rules are no longer drawn
 * here — the Header owns its own short outer strokes, and the content frame
 * (see page) owns the outer + inner rules that start below the nav divider.
 */
export default function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-screen max-w-frame px-5 sm:px-8 xl:px-0">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background from-30% to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-background from-20% to-transparent"
      />
      {children}
    </div>
  );
}
