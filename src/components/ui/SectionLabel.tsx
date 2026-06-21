import { type ReactNode } from "react";

/** Small uppercase, letter-spaced section label (e.g. RECENT WORK). */
export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-eyebrow)] text-[16px] uppercase tracking-[0.12em] text-muted">
      {children}
    </p>
  );
}
