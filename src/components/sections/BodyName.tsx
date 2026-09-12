"use client";

import { useRef, useEffect, useState } from "react";

export default function BodyName() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isGone = !entry.isIntersecting;
        setGone(isGone);
        window.dispatchEvent(new CustomEvent("name-scrolled", { detail: isGone }));
      },
      { rootMargin: "-45px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h1
      ref={ref}
      className={`pt-[140px] text-[18px] font-medium text-heading transition-opacity duration-300 ${
        gone ? "opacity-0" : "opacity-100"
      }`}
    >
      Mukul Chakravarthi
    </h1>
  );
}
