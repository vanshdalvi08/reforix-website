"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";

/* ── Data ── */
const CONTACT_ITEMS = [
  {
    Icon: Mail,
    label: "Email Us",
    value: "info@reforix.com",
    href: "mailto:info@reforix.com",
  },
  {
    Icon: MapPin,
    label: "Our Office",
    value: "Building 16, Vastu Anand, Parsik Nagar",
  },
];

/* ── Variants ── */
const fromLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fromRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 } },
};

const inputClass =
  "w-full bg-[#1a1a1a] border border-white/10 text-white px-4 py-3 text-sm " +
  "focus:outline-none focus:border-accent transition-colors placeholder:text-white/25";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding bg-[#080808] border-t border-white/[0.04]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left column — heading + contact info */}
        <motion.div
          variants={fromLeft}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          <p className="text-xs text-accent tracking-[0.3em] uppercase mb-4">
            GET IN TOUCH
          </p>

          <h2 className="font-black text-5xl md:text-6xl text-white leading-tight mt-3 mb-8">
            Let&apos;s Work
            <br />
            <span className="text-gradient">Together.</span>
          </h2>

          <p className="text-muted text-lg font-light leading-relaxed mb-12">
            Have a project in mind? We&apos;d love to hear about it. Reach out
            and our team will get back to you promptly.
          </p>

          <div className="space-y-8">
            {CONTACT_ITEMS.map(({ Icon, label, value, href }) => (
              <div key={label} className="relative pl-4">
                <div className="absolute left-0 top-0 w-0.5 h-full bg-accent" />
                <div className="flex items-start gap-3">
                  <Icon size={18} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted uppercase tracking-widest">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-white font-medium hover:text-accent transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column — contact form */}
        <motion.div
          variants={fromRight}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="bg-[#111111] border border-white/5 p-8 rounded-sm"
        >
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12">
              <p className="text-accent text-lg font-semibold">
                ✓ Message sent! We&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-2">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your Company Name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-2">
                  Your Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-accent text-white py-4 font-semibold text-sm tracking-wide hover:brightness-110 transition-all"
              >
                Send Message
                <Send size={16} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
