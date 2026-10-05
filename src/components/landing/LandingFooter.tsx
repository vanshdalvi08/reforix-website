import Image from "next/image";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export default function LandingFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Image src="/brand/logo.png" alt="Reforix Engineering Solutions" width={374} height={115} />
            <p>Engineering the future of petroleum infrastructure.</p>
          </div>
          <div>
            <h4>Navigation</h4>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:info@reforix.com">info@reforix.com</a>
            <span style={{ display: "block", color: "#8c8c8c" }}>Building 16, Vastu Anand, Parsik Nagar</span>
            {/* TODO: replace with the company's LinkedIn page. */}
            <a className="li" href="#" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.11 20.45H3.56V9h3.55v11.45z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="foot-b">
          <span>
            © {new Date().getFullYear()} Reforix Engineering Solutions. All rights reserved. AutoCAD, Plant 3D,
            Navisworks and Inventor are trademarks of Autodesk, Inc.
          </span>
          <span>Designed with precision.</span>
        </div>
      </div>
    </footer>
  );
}
