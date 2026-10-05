"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LOCK_CLASS } from "./motion";

const LINKS = [
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Projects", id: "projects" },
  { label: "Careers", id: "careers" },
  { label: "Contact", id: "contact" },
];

export default function LandingNav() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id));
    const update = () => {
      setSolid(window.scrollY > 50);
      const y = window.scrollY + window.innerHeight * 0.4;
      let current = -1;
      sections.forEach((s, i) => {
        if (s && s.offsetTop <= y) current = i;
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(LOCK_CLASS, open);
    return () => document.documentElement.classList.remove(LOCK_CLASS);
  }, [open]);

  return (
    <>
      <header className={`nav${solid ? " solid" : ""}`}>
        <a className="brand" href="#top" aria-label="Reforix Engineering Solutions home">
          <Image src="/brand/logo.png" alt="Reforix Engineering Solutions" width={374} height={115} loading="eager" />
        </a>
        <nav aria-label="Primary">
          {LINKS.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} className={i === active ? "on" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="pill" href="#contact">
          Get in touch
        </a>
        <button
          className="burger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="rx-mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={open ? "M5 5l12 12M17 5L5 17" : "M3 7h16M3 15h16"} />
          </svg>
        </button>
      </header>
      <div className={`mnav${open ? " open" : ""}`} id="rx-mobile-menu" inert={!open}>
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
