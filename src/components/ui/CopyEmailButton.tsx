"use client";

import { useId } from "react";
import * as Button from "@/components/ui/Button";
import { copyEmailWithToast } from "@/components/CopyEmail";

/**
 * The email in the Contact row. A button, not a link: clicking copies the
 * address and raises the same toast the "c" hotkey does, rather than
 * handing the visitor off to a mail client they may not have.
 *
 * The tooltip is what makes that discoverable — an address that looks like
 * a mailto but isn't needs to say so before it's clicked.
 */
export default function CopyEmailButton({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  const tipId = useId();
  return (
    <span className="group/tip relative inline-flex">
      <Button.Root
        variant="neutral"
        mode="ghost"
        size="md"
        className={className}
        aria-describedby={tipId}
        onClick={() => void copyEmailWithToast()}
      >
        {label}
      </Button.Root>
      {/* bg-strong-950 on text-white-0 is AlignUI's tooltip pair, and the
          two inherit each other's inversion — a dark chip with light text
          in light mode, the reverse in dark — so neither theme needs its
          own value. Kept to 12px in a 6px/2px box: this is a hint on a
          link in a row of links, not a panel.

          Opacity only, no rise. Tailwind v4 drives translate through its
          own `translate` property rather than `transform`, which the
          codebase's reduced-motion rule doesn't cover, so a transform here
          would survive a preference it should respect. A fade is what that
          rule would leave anyway. 150ms sits in the 125-200ms the
          animation guidance gives tooltips.

          group-focus-within as well as group-hover: the button is
          keyboard-reachable, and a hint that only exists for a mouse isn't
          one for everybody. */}
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-bg-strong-950 px-1.5 py-0.5 text-[12px] leading-[16px] text-text-white-0 opacity-0 shadow-[var(--shadow-tooltip)] transition-opacity duration-150 ease-[var(--ease-out)] group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        Click to copy
      </span>
    </span>
  );
}
