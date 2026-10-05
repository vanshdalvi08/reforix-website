"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { animate, stagger } from "animejs";
import { CLASHES, LAYER_BALLOONS, createPlantScene } from "./plantScene";
import { READY_EVENT, isIntroDone, prefersReducedMotion } from "./motion";

/** One chapter per AutoCAD-style command, in scroll order. */
const CHAPTERS = [
  {
    command: "LINE",
    title: "From blueprint to reality, every line counts.",
    body: "Inhouse design & drafting services for petroleum plant infrastructure. Precise, clash-free and construction-ready. Scroll to build a plant from a flat plan, pull it apart and check it for clashes.",
  },
  {
    command: "EXTRUDE",
    title: "From plot plan to a full 3D model.",
    body: "We build the plant in AutoCAD Plant 3D: routing pipes, placing equipment, modelling structures, while producing the 2D drawings from the model.",
  },
  {
    command: "LAYON",
    title: "Every line on its own layer.",
    body: "Equipment, structure and each pipe service stay separate and named, the way your engineers and contractors expect to read them.",
  },
  {
    command: "EXPLODE",
    title: "Pull it apart. Every layer stands alone.",
    body: "Each discipline can check its own work, and nothing is hidden behind something else.",
  },
  {
    command: "INTERFERE",
    title: "Find the clashes before the site does.",
    body: "Clash detection and model coordination with Navisworks. Pipe through beam, pipe through column, pipe through pipe, all flagged and fixed in the model.",
  },
  {
    command: "PLOT",
    title: "Then we deliver it construction-ready.",
    body: "What leaves our desk has been through an internal clash check and quality review. Keep scrolling to see who we are and what we do.",
  },
];

const LAYER_CHIPS = [
  { code: "C-STEL", colorVar: "--c-st" },
  { code: "E-EQPT", colorVar: "--c-eq" },
  { code: "P-PROC", colorVar: "--c-proc" },
  { code: "P-STEM", colorVar: "--c-stm" },
  { code: "P-CLWT", colorVar: "--c-cw" },
  { code: "P-INAR", colorVar: "--c-air" },
  { code: "P-DRAN", colorVar: "--c-drn" },
];

const cssVars = (vars: Record<string, string>) => vars as CSSProperties;

export default function PlantHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerBalloonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clashBalloonRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [chapter, setChapter] = useState(0);
  const [layersOn, setLayersOn] = useState(0);
  const [hint, setHint] = useState(true);
  // The state is never rendered, so reading the browser flag here cannot cause a hydration mismatch.
  const [ready, setReady] = useState(() => typeof document !== "undefined" && isIntroDone());

  /* the 3D scene */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-jbmono").trim();
    return createPlantScene({
      canvas,
      stage,
      layerBalloons: layerBalloonRefs.current.filter((el): el is HTMLDivElement => el !== null),
      clashBalloons: clashBalloonRefs.current.filter((el): el is HTMLDivElement => el !== null),
      reduceMotion: prefersReducedMotion(),
      labelFont: mono ? `${mono},Consolas,monospace` : "Consolas,monospace",
      onChapter: setChapter,
      onLayers: setLayersOn,
      onHint: setHint,
    });
  }, []);

  /* wait for the intro before the first headline animates in */
  useEffect(() => {
    const onReady = () => setReady(true);
    window.addEventListener(READY_EVENT, onReady);
    return () => window.removeEventListener(READY_EVENT, onReady);
  }, []);

  /* each chapter's words rise in, and its command is typed on the command line */
  useEffect(() => {
    const el = chapterRefs.current[chapter];
    const cmd = commandRef.current;
    const text = CHAPTERS[chapter].command;
    if (!ready || !el || !cmd) return;
    if (prefersReducedMotion()) {
      cmd.textContent = text;
      return;
    }
    const typed = { n: 0 };
    const running = [
      animate(el.querySelectorAll(".w"), {
        translateY: ["40%", "0%"],
        opacity: [0, 1],
        delay: stagger(50),
        duration: 700,
        ease: "outQuad",
      }),
      animate(el.querySelectorAll("p, .cta"), { opacity: [0, 1], delay: 300, duration: 600, ease: "outQuad" }),
      animate(typed, {
        n: text.length,
        duration: text.length * 45,
        ease: "linear",
        onUpdate: () => {
          cmd.textContent = text.slice(0, Math.round(typed.n));
        },
      }),
    ];
    return () => {
      running.forEach((a) => a.pause());
      cmd.textContent = text;
    };
  }, [chapter, ready]);

  return (
    <>
      <div className="bgfx" aria-hidden="true" />
      <canvas className="scene" ref={canvasRef} aria-hidden="true" />

      <div className="stage" id="top" ref={stageRef}>
        <div className="pin">
          <div className="chapters">
            {CHAPTERS.map((c, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div
                  key={c.command}
                  className={`chapter${i === chapter ? " on" : ""}`}
                  ref={(el) => {
                    chapterRefs.current[i] = el;
                  }}
                >
                  {i === 0 && <span className="tag">Petroleum Plant Engineering</span>}
                  <Heading aria-label={c.title}>
                    {c.title.split(" ").map((word, w) => (
                      <span key={w} aria-hidden="true">
                        <span className="w">{word}</span>{" "}
                      </span>
                    ))}
                  </Heading>
                  <p>{c.body}</p>
                  {i === 0 && (
                    <div className="cta">
                      <a className="pill" href="#projects">
                        Explore our work
                      </a>
                      <a className="pill ghost" href="#contact">
                        Contact us
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="balloons" aria-hidden="true">
            {LAYER_BALLOONS.map((b, i) => (
              <div
                key={b.key}
                className={`bal${b.left ? " l" : ""}`}
                style={cssVars({ "--L": `${b.leader}px`, "--c": `var(${b.colorVar})` })}
                ref={(el) => {
                  layerBalloonRefs.current[i] = el;
                }}
              >
                <i />
                <b>{i + 1}</b>
                <span>{b.label}</span>
              </div>
            ))}
            {CLASHES.map((c, i) => (
              <div
                key={c.id}
                className={`bal red${i % 2 ? " l" : ""}`}
                style={cssVars({ "--L": "34px" })}
                ref={(el) => {
                  clashBalloonRefs.current[i] = el;
                }}
              >
                <i />
                <b>!</b>
                <span>{c.id}</span>
              </div>
            ))}
          </div>

          <p className="hint" style={{ opacity: hint ? 1 : 0 }}>
            Scroll to run the next command
          </p>

          <div className="bar">
            <div className="cmd">
              Command: <b ref={commandRef}>LINE</b>
            </div>
            <ul className="layers" aria-label="Model layers currently switched on">
              {LAYER_CHIPS.map((l, i) => (
                <li key={l.code} className={i < layersOn ? "on" : undefined} style={cssVars({ "--c": `var(${l.colorVar})` })}>
                  <span>{l.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
