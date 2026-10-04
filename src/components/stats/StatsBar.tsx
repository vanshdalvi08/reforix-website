"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useCountUp } from "@/components/ui/useCountUp";

const STATS = [
  { end: 15, suffix: "+", label: "Projects Delivered" },
  { end: 5,  suffix: "+", label: "Years of Experience" },
  { end: 3,  suffix: "+", label: "Industries Served" },
  { end: 100, suffix: "%", label: "On-Time Delivery" },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function StatItem({
  end,
  suffix,
  label,
  trigger,
  isLast,
}: {
  end: number;
  suffix: string;
  label: string;
  trigger: boolean;
  isLast: boolean;
}) {
  const count = useCountUp(end, 2, trigger);

  return (
    <motion.div
      variants={itemVariants}
      className={`flex flex-col items-center text-center py-6 px-4 ${
        !isLast ? "border-r border-white/10" : ""
      }`}
    >
      <span className="text-4xl md:text-5xl font-black text-accent">
        {count}
        {suffix}
      </span>
      <span className="text-sm text-muted font-light mt-2 tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="stats"
      ref={ref}
      className="w-full bg-[#111111] border-y border-white/5 py-16 px-6 md:px-16 lg:px-24"
    >
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {STATS.map((stat, i) => (
          <StatItem
            key={stat.label}
            end={stat.end}
            suffix={stat.suffix}
            label={stat.label}
            trigger={isInView}
            isLast={i === STATS.length - 1}
          />
        ))}
      </motion.div>
    </section>
  );
}
