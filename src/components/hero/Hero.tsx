"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import dynamic from "next/dynamic";

const PlantScene = dynamic(() => import("./PlantScene"), { ssr: false });

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });

const VX = 720;
const VY = 380;
const W = 1440;
const H = 900;
const STROKE = "rgba(232,119,34,0.10)";

function PerspectiveGrid() {
  const radialLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const numRadial = 18;
  for (let i = 0; i <= numRadial; i++) {
    const x2 = (i / numRadial) * (W * 1.3) - W * 0.15;
    radialLines.push({ x1: VX, y1: VY, x2, y2: H });
  }

  const crossLines: { y: number; x1: number; x2: number }[] = [];
  const numCross = 9;
  for (let i = 1; i <= numCross; i++) {
    const t = i / numCross;
    const y = VY + t * (H - VY);
    const tLine = (y - VY) / (H - VY);
    const x1 = VX + tLine * (-W * 0.15 - VX);
    const x2 = VX + tLine * (W * 1.15 - VX);
    crossLines.push({ y, x1, x2 });
  }

  /* lines above VP fanning upward */
  const upperLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const numUpper = 8;
  for (let i = 0; i <= numUpper; i++) {
    const x2 = (i / numUpper) * W;
    upperLines.push({ x1: VX, y1: VY, x2, y2: 0 });
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{
        maskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }}
    >
      {radialLines.map((l, i) => (
        <line
          key={`r${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={STROKE}
          strokeWidth="1"
        />
      ))}
      {crossLines.map((l, i) => (
        <line
          key={`c${i}`}
          x1={l.x1}
          y1={l.y}
          x2={l.x2}
          y2={l.y}
          stroke={STROKE}
          strokeWidth="1"
        />
      ))}
      {upperLines.map((l, i) => (
        <line
          key={`u${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={STROKE}
          strokeWidth="0.7"
        />
      ))}
    </svg>
  );
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex flex-col items-start justify-end">
      {/* Live animated 3D plant — wireframe drone flyover */}
      <div className="absolute inset-0 z-0">
        <PlantScene />

        {/* Dark tint so the scene never fights the copy */}
        <div className="absolute inset-0 bg-[#0a0a0a]/55" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.55) 40%, rgba(10,10,10,0.35) 100%)",
          }}
        />

        {/* Blueprint grid overlay */}
        <PerspectiveGrid />

        {/* Orange radial glow at center-bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(232,119,34,0.14) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-start px-6 md:px-16 lg:px-24 pb-40 md:pb-48"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow tag */}
        <motion.p
          variants={fadeUp}
          className="text-xs text-accent tracking-[0.3em] uppercase mb-6 border border-accent/40 px-3 py-1.5 rounded-full"
        >
          Petroleum Plant Engineering
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className={`${bebas.className} text-4xl md:text-5xl lg:text-6xl leading-[1.0] tracking-wide`}
        >
          <span className="text-white block">From Blueprint to Reality,</span>
          <span className="text-white block">Every Line Counts.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="text-muted text-base md:text-lg font-light max-w-xl mt-6 leading-relaxed"
        >
          Inhouse design & drafting services for petroleum plant infrastructure
          — precise, clash-free, and construction-ready.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 font-semibold text-sm tracking-wide hover:brightness-110 transition-all duration-200"
          >
            Explore Our Work
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-semibold text-sm tracking-wide hover:border-accent hover:text-accent transition-all duration-200"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-muted"
        >
          <ChevronDown size={24} />
        </motion.div>
      </div>
    </section>
  );
}
