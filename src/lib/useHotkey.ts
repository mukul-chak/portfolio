import { useEffect, useRef } from "react";

/**
 * Runs `onPress` when a single letter key is pressed on its own — no ⌘,
 * Ctrl or Alt, and not while the visitor is typing in a field. The site's
 * L / C / R shortcuts.
 */
export function useHotkey(key: string, onPress: () => void) {
  const handler = useRef(onPress);
  handler.current = onPress;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== key || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      handler.current();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key]);
}

/** Runs `onEvent` whenever `name` is dispatched on window. */
export function useWindowEvent(name: string, onEvent: () => void) {
  const handler = useRef(onEvent);
  handler.current = onEvent;

  useEffect(() => {
    const listener = () => handler.current();
    window.addEventListener(name, listener);
    return () => window.removeEventListener(name, listener);
  }, [name]);
}
