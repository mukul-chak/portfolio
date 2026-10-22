import { type ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Small section label (e.g. Work). */
export default function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-[family-name:var(--font-eyebrow)] text-[16px] text-text-sub-600", className)}>
      {children}
    </p>
  );
}
