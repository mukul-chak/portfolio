import { type ReactNode } from "react";

/** Small section label (e.g. Recent work). */
export default function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-[family-name:var(--font-eyebrow)] text-[16px] text-muted ${className}`}>
      {children}
    </p>
  );
}
