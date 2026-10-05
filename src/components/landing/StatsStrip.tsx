"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useCountUp } from "@/components/ui/useCountUp";

const STATS = [
  { end: 15, suffix: "+", label: "Projects delivered" },
  { end: 5, suffix: "+", label: "Years of experience" },
  { end: 3, suffix: "+", label: "Industries served" },
  { end: 100, suffix: "%", label: "On-time delivery" },
];

interface StatProps {
  end: number;
  suffix: string;
  label: string;
  run: boolean;
  instant: boolean;
}

function Stat({ end, suffix, label, run, instant }: StatProps) {
  const count = useCountUp(end, 2, run && !instant);
  return (
    <div className="stat">
      <b>
        {instant ? end : count}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="statbar" id="stats" ref={ref} aria-label="Reforix in numbers">
      <div className="wrap statgrid">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} run={inView} instant={reduce} />
        ))}
      </div>
    </section>
  );
}
