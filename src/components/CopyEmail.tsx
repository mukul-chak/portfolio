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
            <div className="flex w-[260px] items-start gap-3 rounded border border-rule bg-background px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="8" fill="#334155" />
                <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-[14px] font-medium text-text-strong-950">Email copied</p>
                <p className="text-[14px] text-text-soft-400">{EMAIL}</p>
              </div>
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
