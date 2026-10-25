"use client";

import { useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";

/** Dispatched by the bio's "Learn more" link; the drawer opens on it, as on `l`. */
export const OPEN_ABOUT_EVENT = "open-about";

/**
 * "About": the hero bio's longer form, in the same drawer as "Write to me".
 * Body still to be written; no footer, as it asks nothing of the reader.
 */
export default function AboutDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "l" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      setOpen(true);
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_ABOUT_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_ABOUT_EVENT, onOpen);
    };
  }, []);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title="About">
      {null}
    </Drawer>
  );
}
