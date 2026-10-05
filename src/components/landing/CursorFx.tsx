"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer extras for mouse users: a ring that trails the cursor and grows over links,
 * and buttons marked `.mag` that lean toward the pointer. Hidden on touch screens by CSS.
 */
export default function CursorFx() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let started = false;
    let raf = 0;

    const follow = () => {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      ring.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      raf = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.2 ? requestAnimationFrame(follow) : 0;
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!started) {
        started = true;
        x = targetX;
        y = targetY;
        ring.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(follow);

      const target = e.target instanceof Element ? e.target : null;
      const interactive = target?.closest("a, button, label");
      ring.classList.toggle("big", !!interactive && !interactive.closest(".nav, .row"));

      const magnet = target?.closest<HTMLElement>(".mag") ?? null;
      document.querySelectorAll<HTMLElement>(".rx .mag").forEach((el) => {
        if (el !== magnet) {
          el.style.transform = "";
          return;
        }
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cur" ref={ringRef} aria-hidden="true" />;
}
