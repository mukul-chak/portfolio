import { type ReactNode } from "react";

/** Inline underlined link used within body copy (Ascend, SAAG, write to me). */
export default function InlineLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="rounded-sm text-body underline decoration-rule decoration-1 underline-offset-[3px] transition-colors hover:text-heading hover:decoration-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading"
    >
      {children}
    </a>
  );
}
