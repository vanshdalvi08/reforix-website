"use client";

import { useState, type FormEvent } from "react";
import SplitHeading from "./SplitHeading";

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState<{ text: string; error: boolean } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const problem = !name.trim()
      ? "Add your name."
      : !isEmail(email)
        ? "Add a valid email address."
        : !message.trim()
          ? "Tell us a little about your project."
          : null;
    // TODO: send the message to a backend or email service. Nothing leaves the browser yet.
    setNote(
      problem
        ? { text: problem, error: true }
        : { text: "Message captured. This form is not connected to email yet, so nothing was sent.", error: false },
    );
  };

  return (
    <section className="closing" id="contact">
      <div className="wrap">
        <SplitHeading className="closing-h">Let&apos;s work together.</SplitHeading>
        <div className="two" style={{ marginTop: "clamp(20px,4vw,50px)" }}>
          <div>
            <p className="lede">
              Have a project in mind? We&apos;d love to hear about it. Reach out and our team will get back to you
              promptly.
            </p>
            <ul className="cinfo">
              <li>
                <small>Email us</small>
                <a href="mailto:info@reforix.com">info@reforix.com</a>
              </li>
              <li>
                <small>Our office</small>
                <span>Building 16, Vastu Anand, Parsik Nagar</span>
              </li>
            </ul>
          </div>
          <form className="fgrid" onSubmit={handleSubmit} noValidate>
            <label className="f" htmlFor="contact-name">
              Your name
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="f" htmlFor="contact-email">
              Email address
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="f" htmlFor="contact-company">
              Company / organization
              <input
                id="contact-company"
                name="company"
                autoComplete="organization"
                placeholder="Your company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
            <label className="f" htmlFor="contact-message">
              Your message
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us about your project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </label>
            <button className="pill mag" type="submit">
              Send message
            </button>
            <p className={`note${note?.error ? " err" : ""}`} role="status">
              {note?.text}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
