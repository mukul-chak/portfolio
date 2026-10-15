import { type MouseEventHandler, type ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Inline underlined link used within body copy (Ascend, SAAG, write to me). */
export default function InlineLink({
  href,
  external,
  children,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className = "",
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn(
        "rounded-sm text-text-sub-600 underline decoration-rule decoration-1 underline-offset-[3px] transition-colors hover:text-text-strong-950 hover:decoration-text-strong-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-strong-950",
        className,
      )}
    >
      {children}
    </a>
  );
}
