"use client";

import { useState, type FormEvent } from "react";
import SplitHeading from "./SplitHeading";

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

const EXPERIENCE_LEVELS = ["Fresher (0–1 yrs)", "1–3 years", "3–5 years", "5+ years"];

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function CareersSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [note, setNote] = useState<{ text: string; error: boolean } | null>(null);

  const toggleSkill = (skill: string) =>
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const problem = !name.trim()
      ? "Add your name."
      : !isEmail(email)
        ? "Add a valid email address."
        : !experience
          ? "Select your experience level."
          : !resume
            ? "Upload your resume as PDF, DOC or DOCX."
            : null;
    // TODO: send the application to a backend or email service. Nothing leaves the browser yet.
    setNote(
      problem
        ? { text: problem, error: true }
        : { text: "Application captured. This form is not connected to email yet, so nothing was sent.", error: false },
    );
  };

  return (
    <section className="careers" id="careers">
      <div className="wrap two">
        <div>
          <SplitHeading className="sec-h">Build with the best.</SplitHeading>
          <p className="sec-p">
            We&apos;re always looking for talented engineers and designers who are passionate about precision. Tell us
            what you bring to the table.
          </p>
        </div>
        <form className="card fgrid" onSubmit={handleSubmit} noValidate>
          <label className="f" htmlFor="career-name">
            Your name
            <input
              id="career-name"
              name="name"
              autoComplete="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="f" htmlFor="career-email">
            Email address
            <input
              id="career-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="f" htmlFor="career-experience">
            Experience level
            <select
              id="career-experience"
              name="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your experience
              </option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <div className="flab">
            Skills
            <div className="skills" role="group" aria-label="Skills">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="skill"
                  aria-pressed={skills.includes(skill)}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div className="flab">
            Resume / CV
            <label className="drop" htmlFor="career-resume">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 12V3M5 6l4-4 4 4M3 14h12" />
              </svg>
              <span>{resume ? resume.name : "Click to upload PDF, DOC or DOCX"}</span>
              <input
                id="career-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <button className="pill" type="submit">
            Submit application
          </button>
          <p className={`note${note?.error ? " err" : ""}`} role="status">
            {note?.text}
          </p>
        </form>
      </div>
    </section>
  );
}
