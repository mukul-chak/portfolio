"use client";

import { useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";

/** Dispatched by the bio's "Read more about Mukul" link. */
export const OPEN_ABOUT_EVENT = "open-about";

/**
 * "About": the hero bio's longer form, in the same drawer as "Write to me".
 * Body still to be written; no footer, as it asks nothing of the reader.
 */
export default function AboutDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener(OPEN_ABOUT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ABOUT_EVENT, onOpen);
  }, []);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title="About">
      {null}
    </Drawer>
  );
}
