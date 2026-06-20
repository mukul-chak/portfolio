"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { EMAIL } from "@/content/site";
import { copyText } from "@/lib/copyText";

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
      copyText(EMAIL).then((ok) => {
        if (!ok) return;
        toast.custom(
          () => (
            <div className="w-[260px] rounded-lg border border-rule bg-background px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <p className="text-[14px] font-medium text-heading">Email copied</p>
              <p className="mt-0.5 text-[13px] text-muted">{EMAIL}</p>
            </div>
          ),
          { duration: 3000 },
        );
      });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
