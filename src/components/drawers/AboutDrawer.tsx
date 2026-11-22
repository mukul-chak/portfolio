"use client";

import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { copy } from "@/content/copy";
import { useHotkey, useWindowEvent } from "@/lib/useHotkey";

/** Dispatched by the bio's "Learn more" link; the drawer opens on it, as on `l`. */
export const OPEN_ABOUT_EVENT = "open-about";

/**
 * "About": the hero bio's longer form, in the same drawer as "Write to me".
 * Body still to be written; no footer, as it asks nothing of the reader.
 */
export default function AboutDrawer() {
  const [open, setOpen] = useState(false);

  useHotkey("l", () => setOpen(true));
  useWindowEvent(OPEN_ABOUT_EVENT, () => setOpen(true));

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title={copy.about.title}>
      {null}
    </Drawer>
  );
}
