"use client";

import { useEffect } from "react";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { EMAIL } from "@/content/site";
import { copyText } from "@/lib/copyText";

/**
 * Copies the email and raises the confirmation toast.
 *
 * Exported because the Contact section needs the identical behaviour from a
 * button — one copy path and one toast, rather than a second implementation
 * that drifts from this one.
 */
export async function copyEmailWithToast() {
  const ok = await copyText(EMAIL);
  if (!ok) return false;
  showSuccessToast("Email copied", EMAIL);
  return true;
}

/** Global "c" hotkey: copies the email to the clipboard and shows a toast. */
export default function CopyEmail() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "c" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      void copyEmailWithToast();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
