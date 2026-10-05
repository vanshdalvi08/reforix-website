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
    return () => {
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
