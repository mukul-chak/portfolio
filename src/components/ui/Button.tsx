import { type ReactNode } from "react";

/** Outlined pill link, e.g. "Read case study". */
export default function Button({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-block rounded-md border border-rule px-3.5 py-2 text-[14px] font-bold text-heading transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading"
    >
      {children}
    </a>
  );
}
