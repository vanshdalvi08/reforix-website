"use client";

import { useState, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ────────────────────────────────────────────────
   SVG Background Patterns (fallback — no image)
──────────────────────────────────────────────── */
function IsometricGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-iso" width="60" height="35" patternUnits="userSpaceOnUse">
          <path d="M30 0 L60 17.5 L30 35 L0 17.5 Z"
            fill="none" stroke="#E87722" strokeWidth="0.8" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-iso)" />
    </svg>
  );
}
function HorizontalLines() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 30 }, (_, i) => (
        <line key={i} x1="0" y1={`${i * 3.5 + 1}%`} x2="100%" y2={`${i * 3.5 + 1}%`}
          stroke="#E87722" strokeWidth="0.5" opacity="0.07" />
      ))}
    </svg>
  );
}
function GearPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35%" cy="42%" r="110" fill="none" stroke="#E87722"
        strokeWidth="12" opacity="0.04" strokeDasharray="34 17" />
      <circle cx="35%" cy="42%" r="60" fill="none" stroke="#E87722"
        strokeWidth="1.5" opacity="0.07" />
      <circle cx="72%" cy="68%" r="65" fill="none" stroke="#E87722"
        strokeWidth="8" opacity="0.04" strokeDasharray="20 10" />
    </svg>
  );
}
function NodeNetwork() {
  const nodes = [
    { x: 20, y: 28 }, { x: 48, y: 18 }, { x: 76, y: 38 },
    { x: 30, y: 58 }, { x: 60, y: 68 }, { x: 82, y: 63 },
    { x: 42, y: 82 }, { x: 12, y: 52 },
  ];
  const edges = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[0,7],[2,4]];
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
          x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
          stroke="#E87722" strokeWidth="0.6" opacity="0.07" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={`${n.x}%`} cy={`${n.y}%`} r="3.5"
          fill="none" stroke="#E87722" strokeWidth="1" opacity="0.1" />
      ))}
    </svg>
  );
}
function FloorPlanGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-floor" width="80" height="60" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="80" height="60"
            fill="none" stroke="#E87722" strokeWidth="0.6" opacity="0.07" />
          <rect x="8" y="8" width="28" height="20"
            fill="none" stroke="#E87722" strokeWidth="0.4" opacity="0.05" />
          <rect x="44" y="8" width="28" height="20"
            fill="none" stroke="#E87722" strokeWidth="0.4" opacity="0.05" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-floor)" />
    </svg>
  );
}
function CrosshatchLines() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-cross" width="32" height="32" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="32" y2="32" stroke="#E87722" strokeWidth="0.5" opacity="0.07" />
          <line x1="32" y1="0" x2="0" y2="32" stroke="#E87722" strokeWidth="0.5" opacity="0.07" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-cross)" />
    </svg>
  );
}

/* ────────────────────────────────────────────────
   Data
──────────────────────────────────────────────── */
type ServiceItem = {
  number: string;
  title: string[];
  subtitle: string;
  description: string;
  tag: string;
  Pattern: React.ComponentType;
  image?: string;
};

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: ["AutoCAD", "Plant 3D"],
    subtitle: "Engineering Design & Modeling",
    description: "Full 3D plant modeling for petroleum and process facilities. Every pipe, vessel and structure modeled before it's built.",
    tag: "AutoCAD Plant 3D · AutoCAD P&ID",
    Pattern: IsometricGrid,
    image: "/images/service-1-plant3d.jpg",
  },
  {
    number: "02",
    title: ["2D", "Drafting"],
    subtitle: "Construction Drawings & Layouts",
    description: "Construction-ready 2D engineering drawings, general arrangements and technical layouts built to exact specification.",
    tag: "AutoCAD 2D · AutoCAD LT",
    Pattern: HorizontalLines,
    image: "/images/service-2-drafting.jpg",
  },
  {
    number: "03",
    title: ["Mechanical", "Design"],
    subtitle: "Component & System Design",
    description: "Detailed mechanical component and system design for plant equipment from concept through to final drawing.",
    tag: "AutoCAD Mechanical · Inventor",
    Pattern: GearPattern,
    image: "/images/service-3-mechanical.jpg",
  },
  {
    number: "04",
    title: ["Navisworks", "Review"],
    subtitle: "Clash Detection & Coordination",
    description: "Clash detection, model coordination and full project review. We find the problems before the site does.",
    tag: "Navisworks Manage · Navisworks Simulate",
    Pattern: NodeNetwork,
    image: "/images/service-4-navisworks.jpg",
  },
  {
    number: "05",
    title: ["Plant Layout", "Design"],
    subtitle: "Equipment & Facility Planning",
    description: "Optimized equipment and facility layout planning for petroleum plant environments. Every meter matters.",
    tag: "AutoCAD Plant 3D · AutoCAD 2D · SmartPlant",
    Pattern: FloorPlanGrid,
    image: "/images/service-5-layout.jpg",
  },
  {
    number: "06",
    title: ["As-Built", "Docs"],
    subtitle: "Field-Verified Documentation",
    description: "Accurate as-built drawings and complete documentation of existing plant structures. The record that never lies.",
    tag: "AutoCAD 2D · AutoCAD Plant 3D · Recap",
    Pattern: CrosshatchLines,
    image: "/images/service-6-asbuilt.jpg",
  },
];

/* ────────────────────────────────────────────────
   Entrance animation
──────────────────────────────────────────────── */
const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: d },
  }),
};

/* ────────────────────────────────────────────────
   Section
──────────────────────────────────────────────── */
export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative flex flex-col lg:flex-row overflow-hidden border-t border-white/[0.04] lg:h-[calc(100vh-7rem)] gap-[3px] bg-black"
      onMouseLeave={() => setActiveIndex(0)}
    >
      {SERVICES.map((s, i) => {
        const isActive = activeIndex === i;
        const PatternComp = s.Pattern;

        return (
          <motion.div
            key={s.number}
            variants={slideUp}
            custom={i * 0.05}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="relative overflow-hidden bg-[#0e0e0e] cursor-pointer min-h-[160px] lg:min-h-0 lg:h-full"
            style={{
              flex: isActive ? "2.2 1 0%" : "1 1 0%",
              transition: "flex 420ms cubic-bezier(0.4, 0, 0.2, 1)",
              minWidth: 0,
            }}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
          >
            {/* Photo background — consistent filter treatment */}
            {s.image && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${s.image})`,
                  filter: isActive
                    ? "grayscale(0%) brightness(1)"
                    : "grayscale(30%) brightness(0.35)",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                  transition: "filter 500ms ease, transform 500ms ease",
                }}
              />
            )}

            {/* SVG pattern fallback — only when no photo */}
            {!s.image && <PatternComp />}

            {/* Base overlay — constant, prevents flash */}
            <div
              className="absolute inset-0"
              style={{ background: s.image ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.68)" }}
            />

            {/* Text-readability gradient — fades in on expand */}
            {s.image && (
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.10))",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 500ms ease",
                }}
              />
            )}


            {/* ── Collapsed: centered title + subtitle ── */}
            <div
              className="absolute inset-0 flex flex-col justify-center px-6 z-10"
              style={{
                opacity: isActive ? 0 : 1,
                transition: "opacity 220ms ease",
                pointerEvents: "none",
              }}
            >
              <h3 className="font-black text-sm text-white uppercase leading-snug tracking-[0.08em]">
                {s.title.join(" ")}
              </h3>
            </div>

            {/* ── Expanded: large title + description + CTA ── */}
            <div
              className="absolute inset-0 flex flex-col justify-center px-8 pb-4 z-10 overflow-hidden"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 300ms ease 80ms, transform 300ms ease 80ms",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <h3 className="font-black text-3xl text-white leading-tight tracking-tight uppercase mb-3">
                {s.title.map((line, li) => (
                  <span key={li} className="block">{line}</span>
                ))}
              </h3>
              <div className="w-8 h-[2px] bg-accent mb-3" />
              <p className="text-white/45 text-[10px] uppercase tracking-[0.18em] mb-5">
                {s.subtitle}
              </p>
              <p className="text-white/75 text-xs font-light leading-relaxed max-w-[230px] mb-5">
                {s.description}
              </p>
              <span className="border border-white/15 text-white/50 text-[9px] px-2 py-1 w-fit uppercase tracking-wider mb-6 block">
                {s.tag}
              </span>
              <div className="flex items-center gap-1.5 text-accent text-[10px] font-bold uppercase tracking-[0.22em]">
                <span>Learn More</span>
                <ArrowUpRight size={10} />
              </div>
            </div>

            {/* Arrow — top right */}
            <div className="absolute top-6 right-6 z-20">
              <ArrowUpRight
                size={isActive ? 16 : 13}
                style={{
                  color: isActive ? "#E87722" : "rgba(255,255,255,0.15)",
                  transition: "all 300ms ease",
                }}
              />
            </div>
          </motion.div>
        );
      })}

    </section>
  );
}
