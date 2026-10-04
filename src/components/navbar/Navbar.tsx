"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "About", href: "/#identity" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/#projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#contact" },
];

function getFragmentId(href: string): string | null {
  const hashIndex = href.indexOf("#");
  return hashIndex === -1 ? null : href.slice(hashIndex + 1);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => getFragmentId(l.href)).filter(
      (id): id is string => id !== null
    );
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          setActiveSection((prev) => {
            if (entry.isIntersecting) return id;
            return prev === id ? "" : prev;
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out"
        style={{ background: scrolled ? "#ffffff" : "transparent", boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.08)" : "none" }}
      >
        <div
          className="flex items-center justify-between px-6 md:px-16 lg:px-24 transition-all duration-300 ease-in-out"
          style={{ height: scrolled ? "64px" : "100px" }}
        >
          {/* Logo — both always rendered, cross-fade via opacity */}
          <Link href="/" className="relative flex items-center" style={{ width: scrolled ? "36px" : "260px", height: "44px", transition: "width 0.3s ease-in-out" }}>
            {/* Full logo */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
              style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? "none" : "auto" }}
            >
              <Image
                src="/logo.png"
                alt="Reforix Engineering Solutions"
                width={260}
                height={70}
                priority
                className="object-contain w-[180px] md:w-[220px] lg:w-[260px] h-auto"
              />
            </div>
            {/* Compact "R" square */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-accent flex items-center justify-center transition-all duration-300 ease-in-out"
              style={{ opacity: scrolled ? 1 : 0, pointerEvents: scrolled ? "auto" : "none" }}
            >
              <span className="font-black text-white text-lg leading-none">R</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-black uppercase tracking-[0.15em] transition-all duration-300 ease-in-out"
                style={{
                  color: activeSection === getFragmentId(link.href)
                    ? "#E87722"
                    : scrolled ? "#1f2937" : "rgba(255,255,255,0.8)",
                }}
                onMouseEnter={e => { if (activeSection !== getFragmentId(link.href)) (e.currentTarget as HTMLElement).style.color = scrolled ? "#E87722" : "#ffffff"; }}
                onMouseLeave={e => { if (activeSection !== getFragmentId(link.href)) (e.currentTarget as HTMLElement).style.color = scrolled ? "#1f2937" : "rgba(255,255,255,0.8)"; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/#contact"
              className="hidden md:inline-flex px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.15em] transition-all duration-300 ease-in-out"
              style={{
                background: scrolled ? "#E87722" : "transparent",
                color: scrolled ? "#ffffff" : "#ffffff",
                border: scrolled ? "1px solid transparent" : "1px solid rgba(255,255,255,0.5)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                if (scrolled) { el.style.filter = "brightness(1.1)"; }
                else { el.style.background = "#ffffff"; el.style.color = "#000000"; el.style.border = "1px solid #ffffff"; }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.filter = "";
                if (scrolled) { el.style.background = "#E87722"; el.style.color = "#ffffff"; }
                else { el.style.background = "transparent"; el.style.color = "#ffffff"; el.style.border = "1px solid rgba(255,255,255,0.5)"; }
              }}
            >
              Get In Touch
            </Link>
            <button
              className="md:hidden p-1 transition-colors duration-300 ease-in-out"
              style={{ color: scrolled ? "#111111" : "#ffffff" }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay — always dark */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center gap-10"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`text-2xl font-black uppercase tracking-[0.2em] transition-colors duration-200 ${
                  activeSection === getFragmentId(link.href)
                    ? "text-accent"
                    : "text-white hover:text-accent"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/#contact"
              onClick={closeMenu}
              className="border border-accent text-accent px-10 py-3 text-sm font-black uppercase tracking-[0.15em] hover:bg-accent hover:text-white transition-all duration-200 mt-4"
            >
              Get In Touch
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
