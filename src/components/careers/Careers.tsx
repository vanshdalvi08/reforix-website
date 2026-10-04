"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { UploadCloud, FileCheck2, Send, CheckCircle2 } from "lucide-react";

/* ── Pre-set skills for our field ── */
const SKILLS = [
  "AutoCAD Plant 3D",
  "AutoCAD 2D Drafting",
  "AutoCAD Mechanical",
  "Navisworks Manage",
  "Navisworks Simulate",
  "Plant Layout Design",
  "Mechanical Design",
  "P&ID",
  "As-Built Documentation",
  "SmartPlant",
  "Inventor",
  "Recap",
];

const EXPERIENCE_LEVELS = [
  "Fresher (0–1 yrs)",
  "1–3 years",
  "3–5 years",
  "5+ years",
];

/* ── Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

/* ── Field label ── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs text-muted uppercase tracking-widest mb-2">
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-[#1a1a1a] border border-white/10 text-white px-4 py-3 text-sm " +
  "focus:outline-none focus:border-accent transition-colors placeholder:text-white/25";

export default function Careers() {
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const formInView = useInView(formRef, { once: true, margin: "-60px" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="careers" className="section-padding bg-[#0a0a0a]">
      {/* Header */}
      <div ref={headerRef} className="mb-16 text-center max-w-2xl mx-auto">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-xs text-accent tracking-[0.3em] uppercase mb-4"
        >
          JOIN US
        </motion.p>

        <motion.h2
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="font-black text-5xl md:text-6xl text-white leading-tight mt-3"
        >
          Build With
          <br />
          <span className="text-gradient">The Best.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={0.2}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-muted text-lg font-light mt-4"
        >
          We&apos;re always looking for talented engineers and designers who
          are passionate about precision. Tell us what you bring to the table.
        </motion.p>
      </div>

      {/* Form */}
      <motion.div
        ref={formRef}
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate={formInView ? "show" : "hidden"}
        className="max-w-2xl mx-auto bg-[#111111] border border-white/5 p-8 md:p-10"
      >
        {submitted ? (
          <div className="flex flex-col items-center text-center py-12">
            <CheckCircle2 size={40} className="text-accent mb-4" />
            <p className="text-white text-lg font-semibold">
              Application received!
            </p>
            <p className="text-muted text-sm font-light mt-2">
              Thanks for reaching out — our team will review your profile and
              get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <FieldLabel>Your Name</FieldLabel>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Experience level */}
            <div>
              <FieldLabel>Experience Level</FieldLabel>
              <select
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" disabled className="bg-[#1a1a1a]">
                  Select your experience
                </option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level} className="bg-[#1a1a1a]">
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <FieldLabel>Skills</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-sm border transition-all duration-200 ${
                        active
                          ? "bg-accent border-accent text-white"
                          : "border-white/10 text-muted hover:border-accent hover:text-accent"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resume upload */}
            <div>
              <FieldLabel>Resume / CV</FieldLabel>
              <label
                htmlFor="resume-upload"
                className="flex items-center gap-3 border border-dashed border-white/15 px-4 py-4 text-sm cursor-pointer hover:border-accent transition-colors"
              >
                {resumeFile ? (
                  <>
                    <FileCheck2 size={18} className="text-accent shrink-0" />
                    <span className="text-white truncate">{resumeFile.name}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={18} className="text-muted shrink-0" />
                    <span className="text-muted">
                      Click to upload PDF, DOC or DOCX
                    </span>
                  </>
                )}
              </label>
              <input
                id="resume-upload"
                type="file"
                required
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-accent text-white py-4 font-semibold text-sm tracking-wide hover:brightness-110 transition-all"
            >
              Submit Application
              <Send size={16} />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
