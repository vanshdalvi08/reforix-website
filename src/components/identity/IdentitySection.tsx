"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });

/* ── Photo slot ── */
function PhotoSlot({
  label,
  src,
  alt,
  className,
}: {
  label: string;
  src?: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#111111] border border-white/5 flex items-center justify-center group ${className ?? ""}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <>
          {/* Dashed inner border */}
          <div className="absolute inset-[6px] border border-dashed border-white/10 pointer-events-none" />
          {/* Label */}
          <span className="text-[10px] text-white/20 tracking-[0.2em] uppercase select-none">
            {label}
          </span>
        </>
      )}
    </div>
  );
}

/* ── Variants ── */
const fromLeft: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fromRight: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 } },
};

const cardLeft: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 } },
};

const cardRight: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 } },
};

/* ── Component ── */
export default function IdentitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef  = useRef<HTMLDivElement>(null);

  const topInView   = useInView(sectionRef, { once: true, margin: "-100px" });
  const cardsInView = useInView(cardsRef,   { once: true, margin: "-80px" });

  return (
    <section
      id="identity"
      ref={sectionRef}
      className="section-padding bg-[#0a0a0a] overflow-hidden"
    >
      {/* ── TOP HALF ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">

        {/* LEFT — big heading */}
        <motion.div
          variants={fromLeft}
          initial="hidden"
          animate={topInView ? "show" : "hidden"}
        >
          <p className="text-xs text-muted tracking-[0.25em] uppercase mb-6">
            Inhouse Design · Drafting · 3D Modeling
          </p>
          <h2 className="font-black leading-none text-white text-4xl md:text-5xl lg:text-6xl">
            <span className="block">PRECISION</span>
            <span className="block">LIVES IN</span>
            <span className="block text-gradient">THE DETAILS.</span>
          </h2>
          <div className="w-24 h-[2px] bg-accent mt-8" />
        </motion.div>

        {/* RIGHT — text */}
        <motion.div
          variants={fromRight}
          initial="hidden"
          animate={topInView ? "show" : "hidden"}
          className="flex flex-col gap-8"
        >
          {/* Heading */}
          <h3 className={`${bebas.className} text-4xl md:text-5xl text-white leading-[0.95] tracking-wide`}>
            This is where<br />plants take shape.
          </h3>

          {/* Lead sentence — accented left bar */}
          <p className="text-white/85 text-lg md:text-xl font-light leading-relaxed border-l-2 border-accent pl-5">
            Before a single pipe is welded or a vessel is placed —
            someone has to get it right on paper.{" "}
            <span className="text-accent font-medium">That&apos;s us.</span>
          </p>

          {/* Supporting paragraph */}
          <p className="text-muted text-base font-light leading-[1.9] tracking-wide">
            We work deep inside the design process, translating complex
            petroleum plant requirements into precise, clash-free 3D models
            and construction-ready drawings that engineers and contractors
            can actually trust.
          </p>
        </motion.div>
      </div>

      {/* ── BOTTOM HALF — Photo collage ── */}
      <motion.div
        ref={cardsRef}
        variants={cardLeft}
        initial="hidden"
        animate={cardsInView ? "show" : "hidden"}
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "220px 180px",
        }}
      >
        {/* Slot 1 — tall, spans 2 rows */}
        <PhotoSlot
          label="Photo 1"
          className="row-span-2"
        />
        {/* Slot 2 — top middle */}
        <PhotoSlot label="Photo 2" />
        {/* Slot 3 — top right */}
        <PhotoSlot label="Photo 3" />
        {/* Slot 4 — bottom middle */}
        <PhotoSlot label="Photo 4" />
        {/* Slot 5 — bottom right */}
        <PhotoSlot label="Photo 5" />
      </motion.div>

      {/* Section divider */}
      <div className="border-t border-white/[0.04] mt-24" />
    </section>
  );
}
