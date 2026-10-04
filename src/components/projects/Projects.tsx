"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { CheckCircle, Factory } from "lucide-react";

const TAGS = ["AutoCAD Plant 3D", "Navisworks", "Mechanical Design", "Layout Planning"];

function PipeGridPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pipe-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="80" height="80" fill="none" stroke="#E87722" strokeWidth="0.5" opacity="0.06" />
          <circle cx="0" cy="0" r="3" fill="none" stroke="#E87722" strokeWidth="0.5" opacity="0.06" />
          <circle cx="80" cy="0" r="3" fill="none" stroke="#E87722" strokeWidth="0.5" opacity="0.06" />
          <circle cx="0" cy="80" r="3" fill="none" stroke="#E87722" strokeWidth="0.5" opacity="0.06" />
          <circle cx="80" cy="80" r="3" fill="none" stroke="#E87722" strokeWidth="0.5" opacity="0.06" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="#E87722" strokeWidth="0.3" opacity="0.04" />
          <line x1="0" y1="40" x2="80" y2="40" stroke="#E87722" strokeWidth="0.3" opacity="0.04" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pipe-grid)" />
    </svg>
  );
}

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="projects"
      ref={ref}
      className="section-padding bg-[#080808]"
    >
      {/* Header */}
      <motion.div
        variants={fadeLeft}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="mb-16"
      >
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">Our Work</p>
        <h2 className="font-black text-5xl md:text-6xl text-white leading-tight">
          Projects That<br />
          <span className="text-gradient">Speak For Themselves.</span>
        </h2>
      </motion.div>

      {/* Featured card */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-white/[0.06]"
      >
        {/* Visual panel */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="relative lg:col-span-3 min-h-[420px] bg-[#111111] flex items-center justify-center overflow-hidden"
        >
          <PipeGridPattern />

          {/* Watermark number */}
          <span className="absolute top-6 right-8 font-black text-[7rem] leading-none text-white/[0.04] select-none pointer-events-none">
            01
          </span>

          {/* Centered icon */}
          <Factory size={140} className="text-accent/20 relative z-10" strokeWidth={0.8} />

          {/* Left orange bar */}
          <div className="absolute left-0 top-0 w-[3px] h-full bg-accent" />
        </motion.div>

        {/* Info panel */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="lg:col-span-2 bg-[#141414] p-10 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-accent tracking-[0.25em] uppercase mb-4">Featured Project</p>
            <h3 className="font-black text-3xl text-white leading-tight mb-4">
              Tanfac<br />Industries
            </h3>
            <p className="text-muted text-sm font-light leading-relaxed">
              Comprehensive design and drafting services for petroleum plant facility. Scope included full 3D plant modeling, equipment layout planning, mechanical documentation, and Navisworks clash detection review.
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap mt-6 gap-2">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="text-xs border border-accent/30 text-accent/80 px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/[0.06] pt-6 mt-8">
            <div className="flex items-center gap-2 text-accent text-sm font-medium">
              <CheckCircle size={16} />
              <span>Delivered Successfully</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Coming soon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-muted text-sm tracking-wide">
          More case studies coming soon
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            &nbsp;…
          </motion.span>
        </p>
      </motion.div>
    </section>
  );
}
