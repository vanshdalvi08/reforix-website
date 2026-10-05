"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { createTimeline, onScroll, svg } from "animejs";
import SplitHeading from "./SplitHeading";
import { prefersReducedMotion } from "./motion";

/** Each step sits at a valve on the pipe. `x` and `y` are in the pipe drawing's own units (200 by 1000). */
const STEPS = [
  {
    title: "Brief & scope",
    body: "We start by understanding your project deeply: the plant type, scope, deliverables, deadlines, and any site constraints that will shape the design.",
    image: "/images/photo-1.png",
    x: 40,
    y: 130,
    vertical: true,
  },
  {
    title: "Study & planning",
    body: "Before anything is drawn, we study the requirements, reference documents, P&IDs and equipment layouts to build a solid foundation for the design.",
    image: "/images/photo-2.jpg",
    x: 160,
    y: 450,
    vertical: true,
  },
  {
    title: "3D modelling & drafting",
    body: "We build the plant in AutoCAD Plant 3D, routing pipes, placing equipment, modelling structures, while producing 2D drawings from the model.",
    image: "/images/photo-3.png",
    x: 100,
    y: 650,
    vertical: false,
  },
  {
    title: "Review & delivery",
    body: "Every drawing goes through an internal clash check and quality review before delivery. What leaves our desk is construction-ready. No exceptions.",
    image: "/images/photo-4.png",
    x: 40,
    y: 880,
    vertical: true,
  },
];

const PIPE = "M40 0V250Q40 280 70 280H130Q160 280 160 310V620Q160 650 130 650H70Q40 650 40 680V1000";

export default function ProcessSection() {
  const runRef = useRef<HTMLDivElement>(null);
  const pipeRef = useRef<SVGPathElement>(null);
  // Every step starts lit so the content reads without JavaScript or motion.
  const [reached, setReached] = useState(STEPS.length);

  useEffect(() => {
    const run = runRef.current;
    const pipe = pipeRef.current;
    if (!run || !pipe || prefersReducedMotion()) return;

    // Where along the pipe (0 to 100) each valve sits.
    const total = pipe.getTotalLength();
    const stops = STEPS.map((s) => {
      let best = 0;
      let bestDist = Infinity;
      for (let len = 0; len <= total; len += 4) {
        const p = pipe.getPointAtLength(len);
        const d = (p.x - s.x) ** 2 + (p.y - s.y) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = len;
        }
      }
      return Math.max(0, (best / total) * 100 - 1);
    });

    let last = -1;
    const timeline = createTimeline({
      autoplay: onScroll({ target: run, enter: "bottom-=80 top", leave: "center bottom", sync: 0.2 }),
      onUpdate: (self) => {
        const count = stops.filter((at) => self.currentTime >= at).length;
        if (count !== last) {
          last = count;
          setReached(count);
        }
      },
    });
    timeline.add(svg.createDrawable(pipe), { draw: ["0 0", "0 1"], duration: 100, ease: "linear" }, 0);

    return () => {
      timeline.revert();
    };
  }, []);

  return (
    <section className="proc" id="process">
      <div className="wrap proc-grid">
        <div className="proc-head">
          <SplitHeading className="sec-h">The process behind every great delivery</SplitHeading>
          <p className="sec-p">
            From the first brief to the final drawing, here&apos;s how we make sure nothing is left to chance.
          </p>
          <p className="ask">Ready to start your project?</p>
          <p className="sec-p" style={{ marginTop: 8 }}>
            Let&apos;s talk about what you need.
          </p>
          <a className="pill mag" href="#contact">
            Get in touch
          </a>
        </div>
        <div className="run" ref={runRef}>
          <div className="run-svg">
            <svg viewBox="0 0 200 1000" aria-hidden="true">
              <path className="ghost" d={PIPE} />
              <path className="pipe" ref={pipeRef} d={PIPE} />
              {STEPS.map((s, i) => (
                <g key={s.title} transform={`translate(${s.x} ${s.y})${s.vertical ? " rotate(90)" : ""}`}>
                  <path
                    className="vl"
                    d="M-14 -11L14 11V-11L-14 11Z"
                    style={i < reached ? { fill: "var(--accent)" } : undefined}
                  />
                </g>
              ))}
              <path className="end" d="M24 990h32M24 978h32" />
            </svg>
          </div>
          <div className="run-lab">
            {STEPS.map((s, i) => (
              <div key={s.title} className={`st${i < reached ? " on" : ""}`} style={{ "--y": s.y } as CSSProperties}>
                <Image src={s.image} alt="" width={300} height={225} sizes="150px" />
                <div>
                  <b>
                    {s.title} <em>{String(i + 1).padStart(2, "0")}</em>
                  </b>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
