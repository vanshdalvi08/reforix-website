"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger } from "animejs";
import { prefersReducedMotion } from "./motion";

interface SplitHeadingProps {
  as?: "h2" | "h3";
  className?: string;
  children: string;
}

/** A headline whose words rise out of a mask the first time it scrolls into view. */
export default function SplitHeading({ as: Tag = "h2", className, children }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const rise = animate(el.querySelectorAll(".wi"), {
      translateY: ["108%", "0%"],
      duration: 1000,
      delay: stagger(55),
      ease: "outExpo",
      autoplay: onScroll({ target: el, enter: "bottom-=60 top" }),
    });

    // The scroll trigger only fires when the headline crosses the line. If the page opens part way
    // down (a reload, a restored scroll position, a link into a section) it never crosses, so show
    // any headline that is already on screen or above it once scrolling settles.
    let settle = 0;
    const showIfPassed = () => {
      if (!rise.began && el.getBoundingClientRect().top < window.innerHeight - 60) rise.complete();
    };
    const onScrollSettled = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(showIfPassed, 350);
    };
    settle = window.setTimeout(showIfPassed, 900);
    window.addEventListener("scroll", onScrollSettled, { passive: true });

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScrollSettled);
      rise.revert();
    };
  }, []);

  return (
    <Tag ref={ref} className={className} aria-label={children}>
      {children.split(" ").map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="wm">
            <span className="wi">{word}</span>
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}
