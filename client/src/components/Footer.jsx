import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const GithubIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Footer() {
  const { t } = useTheme();

  const footerLinks = [
    {
      heading: "Product",
      links: [
        { label: "Dashboard", to: "/dashboard" },
        { label: "History",   to: "/history" },
        { label: "Pricing",   to: "/pricing" },
        { label: "Contact",   to: "/contact" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About",    to: "/about" },
        { label: "Blog",     to: "/blog" },
        { label: "Careers",  to: "/careers" },
        { label: "Press",    to: "/press" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy",   to: "/privacy" },
        { label: "Terms of Service", to: "/terms" },
        { label: "Cookie Policy",    to: "/cookies" },
        { label: "Security",         to: "/security" },
      ],
    },
  ];

  const socials = [
    { icon: <GithubIcon />,   href: "https://github.com/rishav-kumar-2", label: "GitHub" },
    { icon: <TwitterIcon />,  href: "https://twitter.com",               label: "Twitter" },
    { icon: <LinkedInIcon />, href: "https://linkedin.com",              label: "LinkedIn" },
  ];

  return (
    <footer style={{ background: t.bgCard, borderTop: `1px solid ${t.border}`, fontFamily: "'Outfit', sans-serif", marginTop: "auto" }}>

      {/* Main grid */}
      <div className="footer-grid" style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 48px 40px", display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: "40px" }}>

        {/* Brand column */}
        <div>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "9px", marginBottom: "16px" }}>
            <div style={{ width: "30px", height: "30px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polygon points="5,3 13,8 5,13" fill="#fff" />
                <rect x="2" y="11" width="7" height="1.8" rx="0.9" fill="rgba(255,255,255,0.7)" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.4px", color: t.text }}>
              Note<span style={{ color: "#6366f1" }}>tube</span>
            </span>
          </Link>
          <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.75, fontWeight: 400, maxWidth: "240px", marginBottom: "24px" }}>
            Turn any YouTube video into smart, structured notes powered by Groq AI. Study smarter, not harder.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                style={{ width: "34px", height: "34px", borderRadius: "9px", border: `1px solid ${t.border}`, background: t.bgSecondary, display: "flex", alignItems: "center", justifyContent: "center", color: t.textSecondary, textDecoration: "none", transition: "all 0.15s" }}
                onMouseOver={(e) => { e.currentTarget.style.background = t.bgHover; e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.text; }}
                onMouseOut={(e) => { e.currentTarget.style.background = t.bgSecondary; e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map((col) => (
          <div key={col.heading}>
            <h4 style={{ fontSize: "12px", fontWeight: 700, color: t.text, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: "16px" }}>
              {col.heading}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}
                    style={{ fontSize: "13px", color: t.textMuted, textDecoration: "none", fontWeight: 400, transition: "color 0.15s" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = t.text)}
                    onMouseOut={(e) => (e.currentTarget.style.color = t.textMuted)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${t.border}`, maxWidth: "1100px", margin: "0 auto" }} />

      {/* Bottom bar */}
      <div className="footer-bottom" style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontSize: "12px", color: t.textMuted, fontWeight: 400, margin: 0 }}>
          © 2026 Notetube. All rights reserved.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: t.textMuted, fontWeight: 400 }}>Built with</span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["React", "Express", "Groq AI", "PostgreSQL"].map((tech) => (
              <span key={tech} style={{ fontSize: "11px", fontWeight: 600, color: t.textSecondary, background: t.bgSecondary, border: `1px solid ${t.border}`, borderRadius: "6px", padding: "2px 8px" }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            padding: 40px 24px 24px !important;
            gap: 32px !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1 !important;
          }
          .footer-bottom {
            padding: 16px 24px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}