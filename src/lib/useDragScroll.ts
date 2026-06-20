import { useCallback, useEffect, useRef } from "react";

/**
 * Click-and-drag horizontal panning for a scrollable element, with light
 * momentum on release. Mouse only — touch and trackpad scroll natively.
 *
 * Spread the returned handlers onto the scroll container and assign `ref` to
 * the actual scrollable node.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const raf = useRef<number | null>(null);
  const s = useRef({
    down: false,
    startX: 0,
    startLeft: 0,
    moved: false,
    lastX: 0,
    lastT: 0,
    v: 0, // px per ms
  });

  const stopMomentum = () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  useEffect(() => stopMomentum, []);

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    stopMomentum();
    const st = s.current;
    st.down = true;
    st.moved = false;
    st.startX = e.clientX;
    st.startLeft = el.scrollLeft;
    st.lastX = e.clientX;
    st.lastT = performance.now();
    st.v = 0;
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    const st = s.current;
    if (!el || !st.down) return;
    const dx = e.clientX - st.startX;
    if (Math.abs(dx) > 3) st.moved = true;
    el.scrollLeft = st.startLeft - dx;
    const now = performance.now();
    const dt = now - st.lastT;
    if (dt > 0) st.v = (e.clientX - st.lastX) / dt;
    st.lastX = e.clientX;
    st.lastT = now;
  }, []);

  const end = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    const st = s.current;
    if (!el || !st.down) return;
    st.down = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
    let v = st.v * 16; // velocity -> px per frame
    const decay = 0.92;
    const step = () => {
      if (Math.abs(v) < 0.4) {
        raf.current = null;
        return;
      }
      el.scrollLeft -= v;
      v *= decay;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  // Suppress the click that follows a drag (so card links don't fire).
  const onClickCapture = useCallback((e: React.MouseEvent<T>) => {
    if (s.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return { ref, onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onClickCapture };
}
