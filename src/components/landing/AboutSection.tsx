import Image from "next/image";
import SplitHeading from "./SplitHeading";

const EXPERTISE = ["AutoCAD Plant 3D", "AutoCAD 2D", "Navisworks", "Mechanical Design", "Plant Layout"];

const PHOTOS = [
  { slot: "a", src: "/images/photo-3.png", alt: "A Reforix designer modelling a plant in AutoCAD Plant 3D" },
  { slot: "b", src: "/images/photo-4.png", alt: "Two engineers reviewing piping isometrics and P&IDs" },
  { slot: "c", src: "/images/photo-2.jpg", alt: "Engineers reviewing a P&ID on screen" },
  { slot: "d", src: "/images/photo-1.png", alt: "A team reviewing plans on site" },
];

export default function AboutSection() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="about-top">
          <div>
            <p className="kicker">Inhouse design · Drafting · 3D modelling</p>
            <SplitHeading>Precision lives in the details.</SplitHeading>
            <div className="rule" />
          </div>
          <div>
            <SplitHeading as="h3">This is where plants take shape.</SplitHeading>
            <p className="lead">
              Before a single pipe is welded or a vessel is placed, someone has to get it right on paper.{" "}
              <b>That&apos;s us.</b>
            </p>
            <p className="body">
              We work deep inside the design process, translating complex petroleum plant requirements into precise,
              clash-free 3D models and construction-ready drawings that engineers and contractors can actually trust.
            </p>
            <div className="chips">
              {EXPERTISE.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="collage">
          {PHOTOS.map((p) => (
            <figure className={p.slot} key={p.slot}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 820px) 100vw, 40vw" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
