"use client";

import { useState } from "react";
import Image from "next/image";
import SplitHeading from "./SplitHeading";

const SERVICES = [
  {
    code: "PLANT 3D",
    title: "AutoCAD Plant 3D",
    subtitle: "Engineering design & modelling",
    description:
      "Full 3D plant modelling for petroleum and process facilities. Every pipe, vessel and structure modelled before it's built.",
    tools: "AutoCAD Plant 3D · AutoCAD P&ID",
    image: "/images/service-1-plant3d.jpg",
  },
  {
    code: "2D",
    title: "2D Drafting",
    subtitle: "Construction drawings & layouts",
    description:
      "Construction-ready 2D engineering drawings, general arrangements and technical layouts built to exact specification.",
    tools: "AutoCAD 2D · AutoCAD LT",
    image: "/images/service-2-drafting.jpg",
  },
  {
    code: "MECH",
    title: "Mechanical Design",
    subtitle: "Component & system design",
    description:
      "Detailed mechanical component and system design for plant equipment, from concept through to final drawing.",
    tools: "AutoCAD Mechanical · Inventor",
    image: "/images/service-3-mechanical.jpg",
  },
  {
    code: "REVIEW",
    title: "Navisworks Review",
    subtitle: "Clash detection & coordination",
    description:
      "Clash detection, model coordination and full project review. We find the problems before the site does.",
    tools: "Navisworks Manage · Navisworks Simulate",
    image: "/images/service-4-navisworks.jpg",
  },
  {
    code: "LAYOUT",
    title: "Plant Layout Design",
    subtitle: "Equipment & facility planning",
    description:
      "Optimized equipment and facility layout planning for petroleum plant environments. Every meter matters.",
    tools: "AutoCAD Plant 3D · AutoCAD 2D · SmartPlant",
    image: "/images/service-5-layout.jpg",
  },
  {
    code: "AS-BUILT",
    title: "As-Built Docs",
    subtitle: "Field-verified documentation",
    description:
      "Accurate as-built drawings and complete documentation of existing plant structures. The record that never lies.",
    tools: "AutoCAD 2D · AutoCAD Plant 3D · Recap",
    image: "/images/service-6-asbuilt.jpg",
  },
];

export default function ServicesSection() {
  // Hover and keyboard focus open a row through CSS. Tapping pins one open on touch screens.
  const [pinned, setPinned] = useState<number | null>(null);

  return (
    <section className="svc" id="services">
      <div className="wrap">
        <SplitHeading className="sec-h">What we do</SplitHeading>
        <p className="sec-p">
          Specialized design and drafting services for petroleum plant engineering. Hover a service to see it.
        </p>
        <div className="rows">
          {SERVICES.map((s, i) => (
            <article
              key={s.code}
              className={`row${pinned === i ? " on" : ""}`}
              tabIndex={0}
              onClick={() => setPinned(pinned === i ? null : i)}
            >
              <div className="row-in">
                <span className="row-code">{s.code}</span>
                <h3>{s.title}</h3>
                <div className="row-txt">
                  <b>{s.subtitle}</b>
                  <p>{s.description}</p>
                  <i>{s.tools}</i>
                </div>
                <Image
                  className="row-img"
                  src={s.image}
                  alt=""
                  width={420}
                  height={280}
                  sizes="(max-width: 820px) 100vw, 210px"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
