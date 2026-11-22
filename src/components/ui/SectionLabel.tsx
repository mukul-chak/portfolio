import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small section label (e.g. Work). */
export default function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-eyebrow text-[16px] text-text-sub-600", className)}>
      {children}
    </p>
  );
}
