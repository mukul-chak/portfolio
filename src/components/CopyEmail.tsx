"use client";

import { showSuccessToast } from "@/components/ui/SuccessToast";
import { copy } from "@/content/copy";
import { copyText } from "@/lib/copyText";
import { useHotkey } from "@/lib/useHotkey";

/**
 * Copies the email and raises the confirmation toast.
 *
 * Exported because the Contact section needs the identical behaviour from a
 * button — one copy path and one toast, rather than a second implementation
 * that drifts from this one.
 */
export async function copyEmailWithToast() {
  const ok = await copyText(copy.site.email);
  if (!ok) return false;
  showSuccessToast(copy.notices.emailCopied, copy.site.email);
  return true;
}

/** Global "c" hotkey: copies the email to the clipboard and shows a toast. */
export default function CopyEmail() {
  useHotkey("c", () => void copyEmailWithToast());
  return null;
}
