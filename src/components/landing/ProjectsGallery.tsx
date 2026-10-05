"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { animate, stagger, svg, utils } from "animejs";
import { isometricSvg, plotPlanSvg } from "./drawings";
import { clamp01, isNarrow, prefersReducedMotion } from "./motion";

const SCOPE = [
  "Full 3D plant modelling",
  "Equipment layout planning",
  "Mechanical documentation",
  "Navisworks clash detection review",
];
const TOOLS = ["AutoCAD Plant 3D", "Navisworks", "Mechanical Design", "Layout Planning"];

/** Illustrative clash list. It matches the clash markers in the hero model. */
const CLASH_ROWS = [
  { id: "C-014", between: "Cooling water vs platform", location: "Level 1, bay A", colorVar: "--c-cw" },
  { id: "C-015", between: "Process vs instrument air", location: "Rack, level 2", colorVar: "--c-proc" },
  { id: "C-016", between: "Drain vs column", location: "Grid B/2", colorVar: "--c-drn" },
  { id: "C-017", between: "Drain vs column", location: "Grid C/2", colorVar: "--c-drn" },
  { id: "C-018", between: "Drain vs beam", location: "Level 1, bay C", colorVar: "--c-drn" },
];

const PLOT_PLAN = plotPlanSvg();
const ISOMETRIC = isometricSvg();
const PANEL_COUNT = 5;

/**
 * Featured project as a horizontal gallery. On desktop the section is pinned and vertical scroll
 * moves the track sideways. On phones the panels stack.
 */
export default function ProjectsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    const count = countRef.current;
    if (!section || !track || !bar || !count) return;

    const reduce = prefersReducedMotion();
    let maxShift = 0;
    let current = 0;
    let raf = 0;

    /* each drawing is line-drawn the first time its panel comes into view */
    const drawings = Array.from(track.querySelectorAll<HTMLElement>("[data-draw]")).map((panel) => {
      let play: (() => void) | null = null;
      if (!reduce) {
        const lines = svg.createDrawable(panel.querySelectorAll("svg path:not(.fd):not(.g), svg circle, svg rect"));
        const fades = panel.querySelectorAll("svg text, svg .fd");
        utils.set(lines, { draw: "0 0" });
        utils.set(fades, { opacity: 0 });
        play = () => {
          animate(lines, { draw: ["0 0", "0 1"], duration: 1500, delay: stagger(22), ease: "inOutQuad" });
          animate(fades, { opacity: [0, 1], duration: 700, delay: 1100, ease: "outQuad" });
        };
      }
      return { panel, play, done: false };
    });

    const measure = () => {
      if (isNarrow()) {
        section.style.height = "";
        track.style.transform = "";
        maxShift = 0;
      } else {
        maxShift = Math.max(0, track.scrollWidth - window.innerWidth);
        section.style.height = `${maxShift + window.innerHeight}px`;
      }
      schedule();
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      let settling = false;
      if (maxShift > 0) {
        const target = clamp01(-rect.top / (section.offsetHeight - vh));
        current += (target - current) * (reduce ? 1 : 0.14);
        if (Math.abs(target - current) < 0.0004) current = target;
        else settling = true;
        track.style.transform = `translate3d(${(-current * maxShift).toFixed(1)}px,0,0)`;
        bar.style.transform = `scaleX(${current.toFixed(4)})`;
        count.textContent = String(Math.round(current * (PANEL_COUNT - 1)) + 1).padStart(2, "0");
      }
      for (const d of drawings) {
        if (d.done) continue;
        const b = d.panel.getBoundingClientRect();
        const onScreen = b.left < window.innerWidth * 0.86 && b.right > 0 && b.top < vh * 0.8 && b.bottom > vh * 0.2;
        if (onScreen) {
          d.done = true;
          d.play?.();
        }
      }
      if (settling) schedule();
    };
    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    document.fonts?.ready.then(measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      section.style.height = "";
      track.style.transform = "";
    };
  }, []);

  return (
    <section className="hs" id="projects" ref={sectionRef} aria-label="Projects">
      <div className="hs-sticky">
        <div className="hs-title">Projects that speak for themselves</div>
        <div className="hs-track" ref={trackRef}>
          <article className="pn pn-intro">
            <div className="pn-l">
              <div className="big" aria-hidden="true">
                01
              </div>
              <div className="chips" style={{ marginTop: 0 }}>
                {TOOLS.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="pn-r">
              <p className="kicker" style={{ margin: 0 }}>
                Featured project
              </p>
              <h2>Tanfac Industries</h2>
              <p className="lede">Comprehensive design and drafting services for a petroleum plant facility.</p>
              <ul className="scope">
                {SCOPE.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="done">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M5 8.2l2 2L11 6" />
                </svg>
                Delivered successfully
              </div>
            </div>
          </article>

          <article className="pn" data-draw>
            <div className="pn-head">
              <h3>Equipment layout</h3>
              <span>Plot plan with equipment, steel and every pipe service.</span>
            </div>
            <div className="pn-body">
              <svg
                className="sv"
                viewBox="0 0 760 430"
                role="img"
                aria-label="Illustrative plot plan of a plant skid"
                dangerouslySetInnerHTML={{ __html: PLOT_PLAN }}
              />
            </div>
          </article>

          <article className="pn" data-draw>
            <div className="pn-head">
              <h3>Mechanical documentation</h3>
              <span>Piping isometric with weld numbers and cut lengths.</span>
            </div>
            <div className="pn-body">
              <svg
                className="sv"
                viewBox="0 0 760 430"
                role="img"
                aria-label="Illustrative pipe isometric drawing"
                dangerouslySetInnerHTML={{ __html: ISOMETRIC }}
              />
            </div>
          </article>

          <article className="pn">
            <div className="pn-head">
              <h3>Clash review</h3>
              <span>Every interference reported with its location, then cleared.</span>
            </div>
            <div className="pn-body">
              <div className="tw">
                <table className="ll">
                  <thead>
                    <tr>
                      <th>Clash</th>
                      <th>Between</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLASH_ROWS.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>
                          <i style={{ "--c": `var(${c.colorVar})` } as CSSProperties} />
                          {c.between}
                        </td>
                        <td>{c.location}</td>
                        <td>Resolved</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="pn-note">Navisworks review catches these in the model, so they never reach site.</p>
          </article>

          <article className="pn pn-out">
            <h3>More case studies coming soon.</h3>
            <p>Your project could be next.</p>
            <a className="pill mag" href="#contact">
              Get in touch
            </a>
          </article>
        </div>
        <div className="hs-foot">
          <span>Tanfac Industries. Drawings are illustrative samples of the delivered scope.</span>
          <div className="hs-bar">
            <i ref={barRef} />
          </div>
          <span>
            <b ref={countRef}>01</b> / {String(PANEL_COUNT).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
