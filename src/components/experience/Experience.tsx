"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";

/* ── Data ── */
const STEPS: {
  step: string;
  title: string;
  description: string;
  imageSrc?: string;
}[] = [
  {
    step: "01",
    title: "Brief & Scope",
    description:
      "We start by understanding your project deeply — the plant type, scope, deliverables, deadlines, and any site constraints that will shape the design.",
    imageSrc: "/images/photo-1.png",
  },
  {
    step: "02",
    title: "Study & Planning",
    description:
      "Before anything is drawn, we study the requirements, reference documents, P&IDs, and equipment layouts to build a solid foundation for the design.",
    imageSrc: "/images/photo-2.jpg",
  },
  {
    step: "03",
    title: "3D Modeling & Drafting",
    description:
      "We build the plant in AutoCAD Plant 3D — routing pipes, placing equipment, modeling structures — while simultaneously producing 2D drawings from the model.",
    imageSrc: "/images/photo-3.png",
  },
  {
    step: "04",
    title: "Review & Delivery",
    description:
      "Every drawing goes through an internal clash check and quality review before delivery. What leaves our desk is construction-ready. No exceptions.",
    imageSrc: "/images/photo-4.png",
  },
];

/* ── Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

/* ── Card ── */
function StepCard({
  step,
  title,
  description,
  imageSrc,
  delay,
  inView,
}: {
  step: string;
  title: string;
  description: string;
  imageSrc?: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="group relative flex flex-col justify-between h-full
                 bg-[#111111] border border-white/5
                 overflow-hidden hover:border-white/10 hover:bg-[#141414]
                 transition-all duration-300"
    >
      {/* Full-bleed image header (first card only) */}
      {imageSrc && (
        <div
          className="w-full h-[220px] shrink-0 relative"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient blending image into card bg */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24"
            style={{ background: "linear-gradient(to top, #111111 0%, transparent 100%)" }}
          />
        </div>
      )}

      {/* Text content */}
      <div className="flex flex-col justify-between flex-1 p-10">
        <div>
          {!imageSrc && <div className="mb-10" />}

          <h3 className="font-bold text-2xl text-white mb-4 leading-tight tracking-tight">
            {title}
          </h3>

          <p className="text-muted text-sm font-light leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10" />
      <div className="absolute bottom-0 left-0 h-[2px] bg-accent z-10 w-0 group-hover:w-full transition-all duration-500 ease-out" />

      {/* Watermark step number */}
      <span
        className="absolute -bottom-4 -right-2 font-black leading-none pointer-events-none select-none"
        style={{ fontSize: "9rem", color: "rgba(255,255,255,0.04)" }}
      >
        {step}
      </span>
    </motion.div>
  );
}

/* ── Section ── */
export default function Experience() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef  = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const cardsInView  = useInView(cardsRef,  { once: true, margin: "-60px" });
  const ctaInView    = useInView(ctaRef,    { once: true, margin: "-60px" });

  return (
    <section
      id="experience"
      className="section-padding bg-[#080808] overflow-hidden border-t border-white/[0.04]"
    >
      {/* Header */}
      <div ref={headerRef} className="mb-20">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-xs text-accent tracking-[0.3em] uppercase mb-4"
        >
          HOW WE WORK
        </motion.p>

        <motion.h2
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="font-black text-5xl md:text-6xl text-white leading-tight mt-3"
        >
          The Process Behind
          <br />
          <span className="text-gradient">Every Great Delivery.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={0.2}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-muted text-lg font-light leading-relaxed mt-6 max-w-xl"
        >
          From the first brief to the final drawing — here&apos;s how we make
          sure nothing is left to chance.
        </motion.p>
      </div>

      {/* Cards — desktop: flex so connectors live in normal flow */}
      <div ref={cardsRef}>
        {/* Desktop layout with inline connectors */}
        <div className="hidden lg:flex items-stretch gap-0">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex items-stretch flex-1">
              <div className="flex-1">
                <StepCard
                  {...s}
                  delay={i * 0.1}
                  inView={cardsInView}
                />
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center w-8 shrink-0 text-white/20">
                  <ChevronRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile / tablet grid */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {STEPS.map((s, i) => (
            <StepCard key={s.step} {...s} delay={i * 0.1} inView={cardsInView} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div ref={ctaRef} className="mt-20 text-center">
        <motion.div
          variants={fadeUp}
          custom={0.4}
          initial="hidden"
          animate={ctaInView ? "show" : "hidden"}
        >
          <p className="text-2xl font-bold text-white">
            Ready to start your project?
          </p>
          <p className="text-muted text-base font-light mt-3">
            Let&apos;s talk about what you need.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4
                       font-semibold text-sm tracking-wide mt-8
                       hover:brightness-110 transition-all duration-200"
          >
            Get In Touch
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
