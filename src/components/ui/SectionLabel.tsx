import { type ReactNode } from "react";

/** Small uppercase, letter-spaced section label (e.g. RECENT WORK). */
export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] uppercase tracking-[0.12em] text-muted">
      {children}
    </p>
  );
}
