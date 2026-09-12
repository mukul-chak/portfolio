import { type ReactNode } from "react";

/** Inline keyboard-key badge with a subtle stroke (e.g. the "c" hotkey hint). */
export default function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex min-w-[1.4em] items-center justify-center rounded-md border border-rule px-1 pt-[1px] pb-[3px] align-[0.06em] font-sans text-[13px] leading-none text-text-sub-600">
      {children}
    </kbd>
  );
}
