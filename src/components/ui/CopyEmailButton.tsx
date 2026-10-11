"use client";

import * as Button from "@/components/ui/Button";
import { copyEmailWithToast } from "@/components/CopyEmail";

/**
 * The email in the Contact row. A button, not a link: clicking copies the
 * address and raises the same toast the "c" hotkey does, rather than
 * handing the visitor off to a mail client they may not have.
 */
export default function CopyEmailButton({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <Button.Root
      variant="neutral"
      mode="ghost"
      size="md"
      className={className}
      onClick={() => void copyEmailWithToast()}
    >
      {label}
    </Button.Root>
  );
}
