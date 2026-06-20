"use client";

import { useEffect } from "react";
import { Toast } from "@base-ui/react/toast";
import { EMAIL } from "@/content/site";
import { copyText } from "@/lib/copyText";

/** Global "c" hotkey: copies the email to the clipboard and shows a toast. */
export default function CopyEmail() {
  const toast = Toast.useToastManager();

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
      copyText(EMAIL).then((ok) => {
        if (ok) {
          toast.add({
            title: "Email copied",
            description: EMAIL,
            timeout: 3000,
          });
        }
      });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toast]);

  return null;
}
