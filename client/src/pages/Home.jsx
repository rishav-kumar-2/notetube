import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, Sun, Moon, Menu, X } from "lucide-react";
import Footer from "../components/Footer";

const features = [
  { icon: "🧠", title: "AI Summarization", desc: "Get concise summaries of any YouTube video powered by Groq AI." },
  { icon: "🌍", title: "Multi-language", desc: "Supports Hindi, Spanish, French and 50+ more. Always outputs in English." },
  { icon: "📝", title: "Personal Notes", desc: "Add your own notes to any summary and save them for later." },
  { icon: "⚡", title: "Key Points", desc: "Auto-extracted bullet points so you never miss what matters." },
  { icon: "📚", title: "History", desc: "All summaries saved in one place. Search and revisit anytime." },
  { icon: "📋", title: "Copy & Export", desc: "Copy your summary and notes with one click to use anywhere." },
];

const steps = [
  { n: "1", title: "Paste a YouTube URL", desc: "Copy any YouTube video link and paste it into the input box on your dashboard." },
  { n: "2", title: "AI fetches and summarizes", desc: "Our system fetches the transcript and sends it to Groq AI to generate a smart summary." },
  { n: "3", title: "Read, take notes, save", desc: "View the summary and key points, then add your own personal notes. Everything saved automatically." },
];

const stats = [
  { num: "10x", label: "Faster learning" },
  { num: "50+", label: "Languages supported" },
  { num: "100%", label: "Free to start" },
];

export default function Home() {
  const { user, logout } = useAuth();
  const { t, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate("/");
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const firstName = user?.name?.split(" ")[0] ?? "";

  const guestLinks = [
    { label: "Home",    to: "/" },
    { label: "Pricing", to: "/pricing" },
    { label: "Contact", to: "/contact" },
  ];
  const authLinks = [
    { label: "Home",      to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "History",   to: "/history" },
    { label: "Contact",   to: "/contact" },
  ];
  const navLinks = user ? authLinks : guestLinks;

  return (
    <div style={{ background: t.bg, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: t.text }}>

      {/* ── Navbar ── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 48px", background: t.navBg, backdropFilter: "blur(12px)", borderBottom: `1px solid ${t.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "9px" }}>
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

        {/* Desktop Nav links */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2px", background: t.bgSecondary, borderRadius: "100px", padding: "4px" }}>
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} style={{ textDecoration: "none" }}>
              <button
                style={{ padding: "7px 18px", borderRadius: "100px", border: "none", background: "transparent", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.textSecondary, cursor: "pointer", transition: "background 0.15s, color 0.15s" }}
                onMouseOver={(e) => { e.currentTarget.style.background = t.bgCard; e.currentTarget.style.color = t.text; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textSecondary; }}
              >
                {label}
              </button>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.bgCard, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.textSecondary, transition: "all 0.15s" }}
            onMouseOver={(e) => { e.currentTarget.style.background = t.bgHover; e.currentTarget.style.color = t.text; }}
            onMouseOut={(e) => { e.currentTarget.style.background = t.bgCard; e.currentTarget.style.color = t.textSecondary; }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Desktop auth buttons */}
          {user ? (
            <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: t.textSecondary }}>Hi, {firstName} 👋</span>
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  style={{ width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.text, display: "flex", alignItems: "center", justifyContent: "center", color: t.bg, fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
                >
                  {initial}
                </button>
                {showDropdown && (
                  <div style={{ position: "absolute", right: 0, marginTop: "8px", width: "200px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "14px", padding: "8px", boxShadow: t.shadow, zIndex: 100 }}>
                    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${t.border}`, marginBottom: "6px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: t.text, margin: 0 }}>{user?.name ?? "User"}</p>
                      <p style={{ fontSize: "11px", color: t.textMuted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email ?? ""}</p>
                    </div>
                    <Link to="/dashboard" style={{ textDecoration: "none" }} onClick={() => setShowDropdown(false)}>
                      <button style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: "8px", border: "none", background: "transparent", fontSize: "13px", fontWeight: 600, color: t.text, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
                        onMouseOver={(e) => (e.currentTarget.style.background = t.bgHover)}
                        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                      >Dashboard</button>
                    </Link>
                    <button onClick={handleLogout}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "8px", border: "none", background: "transparent", fontSize: "13px", fontWeight: 600, color: "#e53e3e", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
                      onMouseOver={(e) => (e.currentTarget.style.background = isDark ? "#2a0a0a" : "#fff5f5")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="desktop-nav" style={{ display: "flex", gap: "8px" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button style={{ padding: "9px 20px", borderRadius: "100px", border: `1.5px solid ${t.btnSecondaryBorder}`, background: t.bgCard, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.text, cursor: "pointer" }}>Sign in</button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button style={{ padding: "9px 20px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.btnPrimaryText, cursor: "pointer" }}>Get started free</button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            style={{ display: "none", width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.bgCard, alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.text }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} style={{ textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>
              <button style={{ width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "10px", border: "none", background: "transparent", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "14px", color: t.text, cursor: "pointer" }}>
                {label}
              </button>
            </Link>
          ))}
          <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: "8px", marginTop: "4px", display: "flex", gap: "8px" }}>
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: isDark ? "#2a0a0a" : "#fff5f5", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: "#e53e3e", cursor: "pointer" }}
              >Sign out</button>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: "none", flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <button style={{ width: "100%", padding: "10px", borderRadius: "10px", border: `1.5px solid ${t.btnSecondaryBorder}`, background: t.bgCard, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.text, cursor: "pointer" }}>Sign in</button>
                </Link>
                <Link to="/register" style={{ textDecoration: "none", flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <button style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.btnPrimaryText, cursor: "pointer" }}>Get started</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="hero-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "580px", borderBottom: `1px solid ${t.border}` }}>
        <div className="hero-left" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 56px", borderRight: `1px solid ${t.border}` }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "100px", background: t.bgSecondary, fontSize: "12px", fontWeight: 600, color: t.textSecondary, width: "fit-content", marginBottom: "24px" }}>
            ✨ Powered by Groq AI
          </span>
          <h1 className="hero-h1" style={{ fontSize: "54px", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", color: t.text, marginBottom: "18px" }}>
            Turn YouTube<br />Videos Into<br />
            <span style={{ color: t.textMuted }}>Smart Notes.</span>
          </h1>
          <p style={{ fontSize: "15px", color: t.textSecondary, maxWidth: "360px", lineHeight: 1.75, marginBottom: "32px", fontWeight: 400 }}>
            Paste any YouTube URL and get an AI-powered summary, key points, and personal notes in seconds.
          </p>
          <div className="hero-buttons" style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
            {user ? (
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <button style={{ padding: "13px 28px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "14px", color: t.btnPrimaryText, cursor: "pointer" }}>Go to Dashboard →</button>
              </Link>
            ) : (
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button style={{ padding: "13px 28px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "14px", color: t.btnPrimaryText, cursor: "pointer" }}>Start for free →</button>
              </Link>
            )}
            <button style={{ padding: "13px 28px", borderRadius: "100px", border: `1.5px solid ${t.btnSecondaryBorder}`, background: t.bgCard, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "14px", color: t.text, cursor: "pointer" }}>▶ Watch demo</button>
          </div>
          <div className="url-bar" style={{ display: "flex", alignItems: "center", background: t.bgSecondary, borderRadius: "14px", padding: "6px 6px 6px 16px", maxWidth: "420px" }}>
            <input type="text" placeholder="https://www.youtube.com/watch?v=..." readOnly
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: t.textMuted, fontWeight: 400 }}
            />
            <button style={{ padding: "9px 16px", borderRadius: "10px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, color: t.btnPrimaryText, cursor: "pointer", whiteSpace: "nowrap" }}>✨ Summarize</button>
          </div>
        </div>
        <div className="hero-right" style={{ position: "relative", overflow: "hidden", background: t.bgCard, minHeight: "580px" }}>
          <img src="/hero.png" alt="Notetube hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", mixBlendMode: isDark ? "screen" : "multiply", display: "block" }} />
          <div style={{ position: "absolute", top: "28px", right: "28px", background: t.bgCard, borderRadius: "12px", padding: "9px 14px", fontSize: "12px", fontWeight: 700, color: t.text, boxShadow: t.shadowCard, zIndex: 2 }}>📝 Notes saved instantly</div>
          <div style={{ position: "absolute", bottom: "32px", left: "28px", background: t.invertedBg, borderRadius: "12px", padding: "9px 14px", fontSize: "12px", fontWeight: 700, color: t.invertedText, boxShadow: t.shadowCard, zIndex: 2 }}>🌍 50+ languages supported</div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${t.border}` }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "36px 24px", borderRight: i < 2 ? `1px solid ${t.border}` : "none" }}>
            <div style={{ fontSize: "38px", fontWeight: 900, letterSpacing: "-2px", color: t.text }}>{s.num}</div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: t.textMuted, marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section className="features-section" style={{ padding: "80px 48px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 className="section-h2" style={{ fontSize: "40px", fontWeight: 900, textAlign: "center", letterSpacing: "-2px", marginBottom: "10px", color: t.text }}>Everything you need</h2>
        <p style={{ textAlign: "center", color: t.textMuted, fontSize: "14px", fontWeight: 400, marginBottom: "48px" }}>Powerful features to supercharge your learning</p>
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          {features.map((f, i) => (
            <div key={f.title}
              style={{ padding: "28px", borderRadius: "20px", background: i === 2 || i === 3 ? t.invertedBg : t.bgSecondary, cursor: "default", transition: "background 0.2s" }}
              onMouseOver={(e) => { if (i !== 2 && i !== 3) e.currentTarget.style.background = t.bgHover; }}
              onMouseOut={(e) => { if (i !== 2 && i !== 3) e.currentTarget.style.background = t.bgSecondary; }}
            >
              <div style={{ fontSize: "26px", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: i === 2 || i === 3 ? t.invertedText : t.text, marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: i === 2 || i === 3 ? (isDark ? "#555" : "#888") : t.textSecondary, lineHeight: 1.7, fontWeight: 400 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="howitworks-section" style={{ padding: "80px 48px", background: t.invertedBg }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 className="section-h2-inv" style={{ fontSize: "40px", fontWeight: 900, textAlign: "center", letterSpacing: "-2px", marginBottom: "10px", color: t.invertedText }}>How it works</h2>
          <p style={{ textAlign: "center", color: isDark ? "#555" : "#666", fontSize: "14px", fontWeight: 400, marginBottom: "48px" }}>Three simple steps to smarter learning</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {steps.map((s) => (
              <div key={s.n}
                style={{ display: "flex", gap: "18px", alignItems: "flex-start", background: isDark ? "#e8e8e8" : "#161616", borderRadius: "18px", padding: "22px", transition: "background 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.background = isDark ? "#d0d0d0" : "#1e1e1e")}
                onMouseOut={(e) => (e.currentTarget.style.background = isDark ? "#e8e8e8" : "#161616")}
              >
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: t.invertedBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 900, color: t.invertedText, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: t.invertedText, marginBottom: "6px" }}>{s.title}</h3>
                  <p style={{ fontSize: "13px", color: isDark ? "#555" : "#666", lineHeight: 1.7, fontWeight: 400 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" style={{ padding: "80px 48px", textAlign: "center" }}>
        <div className="cta-box" style={{ maxWidth: "520px", margin: "0 auto", background: t.bgSecondary, borderRadius: "28px", padding: "64px 48px" }}>
          <h2 className="section-h2" style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "14px", lineHeight: 1.1, color: t.text }}>Ready to learn<br />smarter?</h2>
          <p style={{ fontSize: "14px", color: t.textMuted, fontWeight: 400, marginBottom: "32px" }}>Join thousands of students and professionals saving time with Notetube.</p>
          {user ? (
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{ padding: "14px 36px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "14px", color: t.btnPrimaryText, cursor: "pointer" }}>Go to Dashboard →</button>
            </Link>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button style={{ padding: "14px 36px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "14px", color: t.btnPrimaryText, cursor: "pointer" }}>Get started for free →</button>
              </Link>
              <div style={{ marginTop: "16px", fontSize: "12px", color: t.textMuted, fontWeight: 400 }}>No credit card required · Cancel anytime</div>
            </>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Mobile Responsive Styles ── */}
      <style>{`
        @media (max-width: 768px) {
          nav { padding: 12px 16px !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hero-section { grid-template-columns: 1fr !important; min-height: auto !important; }
          .hero-right { display: none !important; }
          .hero-left { padding: 40px 24px !important; border-right: none !important; }
          .hero-h1 { font-size: 36px !important; letter-spacing: -1.5px !important; }
          .hero-buttons { flex-direction: column !important; }
          .hero-buttons a, .hero-buttons button { width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
          .url-bar { max-width: 100% !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid ${t.border} !important; padding: 20px 16px !important; }
          .features-section { padding: 48px 20px !important; }
          .section-h2 { font-size: 28px !important; letter-spacing: -1px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .howitworks-section { padding: 48px 20px !important; }
          .section-h2-inv { font-size: 28px !important; letter-spacing: -1px !important; }
          .cta-section { padding: 48px 20px !important; }
          .cta-box { padding: 40px 24px !important; border-radius: 20px !important; }
        }
      `}</style>
    </div>
  );
}