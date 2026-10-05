"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, stagger } from "animejs";
import { LOCK_CLASS, markIntroDone, prefersReducedMotion } from "./motion";

/**
 * Intro: corner brackets frame the centre, an orange scan line plots the logo left to right,
 * then the logo zooms through as the curtain lifts.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const scanRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const logo = logoRef.current;
    const scan = scanRef.current;
    const count = countRef.current;
    const fill = fillRef.current;
    if (!root || !frame || !logo || !scan || !count || !fill) return;

    if (prefersReducedMotion()) {
      markIntroDone();
      return;
    }

    const html = document.documentElement;
    let cancelled = false;
    const timers: number[] = [];
    html.classList.add(LOCK_CLASS);
    logo.style.clipPath = "inset(0 100% 0 0)";
    scan.style.opacity = "0";

    const finish = () => {
      if (cancelled) return;
      html.classList.remove(LOCK_CLASS);
      setDone(true);
    };

    const progress = { p: 0 };
    const running = [
      animate(root.querySelectorAll(".pl-br"), {
        opacity: [0, 1],
        scale: [1.35, 1],
        duration: 800,
        delay: stagger(90),
        ease: "outExpo",
      }),
      animate(progress, {
        p: 100,
        duration: 2000,
        delay: 450,
        ease: "inOutCubic",
        onUpdate: () => {
          const p = progress.p;
          logo.style.clipPath = `inset(0 ${(100 - p).toFixed(2)}% 0 0)`;
          scan.style.left = `${p.toFixed(2)}%`;
          scan.style.opacity = p > 0.3 && p < 99.5 ? "1" : "0";
          count.textContent = `${Math.round(p)}%`;
          fill.style.transform = `scaleX(${p / 100})`;
        },
        onComplete: () => {
          if (cancelled) return;
          logo.style.clipPath = "none";
          running.push(
            animate(frame, { scale: [1, 1.14], duration: 1100, ease: "inCubic" }),
            animate(root, {
              translateY: ["0%", "-100%"],
              duration: 900,
              delay: 500,
              ease: "inOutExpo",
              onComplete: finish,
            }),
          );
          // Start the hero's own reveal while the curtain is still lifting.
          timers.push(window.setTimeout(markIntroDone, 900));
        },
      }),
    ];
    // Never leave the page locked if an animation stalls.
    timers.push(
      window.setTimeout(() => {
        markIntroDone();
        finish();
      }, 8000),
    );

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      running.forEach((a) => a.revert());
      html.classList.remove(LOCK_CLASS);
    };
  }, []);

  if (done) return null;

  return (
    <div className="pl" ref={rootRef} aria-hidden="true">
      <div className="pl-top">
        <span>Petroleum plant engineering</span>
        <b ref={countRef}>0%</b>
      </div>
      <div className="pl-mid">
        <div className="pl-frame" ref={frameRef}>
          <span className="pl-br tl" />
          <span className="pl-br tr" />
          <span className="pl-br bl" />
          <span className="pl-br br" />
          <div className="pl-logo">
            <Image ref={logoRef} src="/brand/logo-xl.png" alt="" width={694} height={206} loading="eager" />
            <i className="pl-scan" ref={scanRef} />
          </div>
        </div>
      </div>
      <div className="pl-line">
        <i ref={fillRef} />
      </div>
    </div>
  );
}
