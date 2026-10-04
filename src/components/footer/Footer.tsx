"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

const NAV_LINKS = [
  { label: "About", href: "/#identity" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/#projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#contact" },
];

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.11 20.45H3.56V9h3.55v11.45z" />
    </svg>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer
      ref={ref}
      className="relative bg-[#050505] border-t border-white/5 pt-16 pb-8 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Watermark */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black leading-none pointer-events-none select-none whitespace-nowrap"
        style={{ fontSize: "9rem", color: "rgba(255,255,255,0.02)" }}
      >
        REFORIX
      </span>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/5"
      >
        {/* Brand */}
        <div>
          <Image
            src="/logo.png"
            alt="Reforix Engineering Solutions"
            width={140}
            height={38}
            className="object-contain w-[140px] h-auto mb-4"
          />
          <p className="text-muted text-sm font-light leading-relaxed max-w-xs">
            Engineering the future of
            <br />
            petroleum infrastructure.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-4">
            Navigation
          </p>
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-gray-500 hover:text-white transition-colors w-fit"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-4">
            Contact
          </p>
          <a
            href="mailto:info@reforix.com"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors mb-3 w-fit"
          >
            <Mail size={14} />
            info@reforix.com
          </a>
          <p className="flex items-start gap-2 text-sm text-gray-500 mb-6">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            Building 16, Vastu Anand, Parsik Nagar
          </p>
          <a
            href="#"
            aria-label="LinkedIn"
            className="inline-flex w-8 h-8 border border-white/10 items-center justify-center text-muted hover:border-accent hover:text-accent transition-all"
          >
            <LinkedInIcon />
          </a>
        </div>
      </motion.div>

      {/* Bottom row */}
      <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-center md:text-left">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} Reforix Engineering Solutions. All rights reserved.
        </p>
        <p className="text-xs text-gray-700 italic">Designed with precision.</p>
      </div>
    </footer>
  );
}
