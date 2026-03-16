import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Mail, MessageSquare, User, Sun, Moon } from "lucide-react";
import Footer from "../components/Footer";

export default function Contact() {
  const { user } = useAuth();
  const { t, isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    name:    user?.name  ?? "",
    email:   user?.email ?? "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) return;
    setError("");
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setForm({ name: user?.name ?? "", email: user?.email ?? "", subject: "", message: "" });
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${t.border}`,
    background: t.bgInput,
    fontSize: "13px",
    color: t.text,
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: t.textSecondary,
    marginBottom: "6px",
  };

  const infoCards = [
    { icon: <Mail size={17} />,        title: "Email us",  desc: "For general inquiries and support", value: "support@notetube.app" },
    { icon: <MessageSquare size={17} />, title: "Feedback", desc: "Help us improve Notetube",           value: "feedback@notetube.app" },
    { icon: <User size={17} />,         title: "Built by",  desc: "A solo developer passionate about learning", value: "Notetube Team · India" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Outfit', sans-serif" }}>

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 48px",
          background: t.navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${t.border}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
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

        {/* Right */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.bgCard, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.textSecondary, transition: "all 0.15s" }}
            onMouseOver={(e) => { e.currentTarget.style.background = t.bgHover; e.currentTarget.style.color = t.text; }}
            onMouseOut={(e) => { e.currentTarget.style.background = t.bgCard; e.currentTarget.style.color = t.textSecondary; }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {user ? (
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <button
                style={{ padding: "9px 20px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.btnPrimaryText, cursor: "pointer", transition: "background 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.background = t.btnPrimaryHover)}
                onMouseOut={(e) => (e.currentTarget.style.background = t.btnPrimary)}
              >
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{ padding: "9px 20px", borderRadius: "100px", border: `1.5px solid ${t.btnSecondaryBorder}`, background: t.bgCard, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.text, cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = t.text)}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = t.btnSecondaryBorder)}
                >
                  Sign in
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button
                  style={{ padding: "9px 20px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", color: t.btnPrimaryText, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = t.btnPrimaryHover)}
                  onMouseOut={(e) => (e.currentTarget.style.background = t.btnPrimary)}
                >
                  Get started free
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "64px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h1 style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-2px", color: t.text, marginBottom: "12px" }}>
            Get in touch
          </h1>
          <p style={{ fontSize: "15px", color: t.textMuted, fontWeight: 400, maxWidth: "400px", margin: "0 auto", lineHeight: 1.7 }}>
            Have a question, suggestion, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "20px", alignItems: "start" }}>

          {/* Left — info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {infoCards.map((card) => (
              <div key={card.title} style={{ background: t.bgCard, borderRadius: "18px", padding: "20px", boxShadow: t.shadowCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: t.bgSecondary, display: "flex", alignItems: "center", justifyContent: "center", color: t.text, flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: t.text, margin: 0 }}>{card.title}</h3>
                </div>
                <p style={{ fontSize: "12px", color: t.textMuted, margin: "0 0 4px", fontWeight: 400 }}>{card.desc}</p>
                <p style={{ fontSize: "13px", color: t.text, margin: 0, fontWeight: 600 }}>{card.value}</p>
              </div>
            ))}

            {/* Response time — always dark card */}
            <div style={{ background: t.invertedBg, borderRadius: "18px", padding: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: t.invertedText, margin: "0 0 6px" }}>⚡ Quick response</p>
              <p style={{ fontSize: "12px", color: isDark ? "#555" : "#666", margin: 0, fontWeight: 400, lineHeight: 1.6 }}>
                We typically respond within 24 hours on weekdays.
              </p>
            </div>
          </div>

          {/* Right — contact form */}
          <div style={{ background: t.bgCard, borderRadius: "24px", padding: "36px", boxShadow: t.shadow }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: isDark ? "#0d2b1a" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "26px" }}>
                  ✅
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: t.text, letterSpacing: "-0.5px", marginBottom: "8px" }}>
                  Message sent!
                </h3>
                <p style={{ fontSize: "14px", color: t.textMuted, fontWeight: 400, marginBottom: "28px", lineHeight: 1.6 }}>
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  style={{ padding: "11px 24px", borderRadius: "100px", border: "none", background: t.btnPrimary, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "13px", color: t.btnPrimaryText, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = t.btnPrimaryHover)}
                  onMouseOut={(e) => (e.currentTarget.style.background = t.btnPrimary)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: t.text, letterSpacing: "-0.5px", marginBottom: "6px" }}>
                  Send a message
                </h2>
                <p style={{ fontSize: "14px", color: t.textMuted, fontWeight: 400, marginBottom: "28px" }}>
                  Fill in the form and we'll be in touch soon.
                </p>

                {error && (
                  <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "12px", background: isDark ? "#2a0a0a" : "#fff5f5", border: `1px solid ${isDark ? "#4a1a1a" : "#fed7d7"}`, color: "#e53e3e", fontSize: "13px", fontWeight: 500 }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={labelStyle}>Full name</label>
                      <input
                        name="name" type="text" placeholder="John Doe"
                        value={form.name} onChange={handleChange} required disabled={loading}
                        style={{ ...inputStyle, opacity: loading ? 0.6 : 1 }}
                        onFocus={(e) => (e.target.style.borderColor = t.borderFocus)}
                        onBlur={(e) => (e.target.style.borderColor = t.border)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        name="email" type="email" placeholder="you@example.com"
                        value={form.email} onChange={handleChange} required disabled={loading}
                        style={{ ...inputStyle, opacity: loading ? 0.6 : 1 }}
                        onFocus={(e) => (e.target.style.borderColor = t.borderFocus)}
                        onBlur={(e) => (e.target.style.borderColor = t.border)}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Subject</label>
                    <input
                      name="subject" type="text" placeholder="What's this about?"
                      value={form.subject} onChange={handleChange} required disabled={loading}
                      style={{ ...inputStyle, opacity: loading ? 0.6 : 1 }}
                      onFocus={(e) => (e.target.style.borderColor = t.borderFocus)}
                      onBlur={(e) => (e.target.style.borderColor = t.border)}
                    />
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      name="message" placeholder="Write your message here..."
                      value={form.message} onChange={handleChange} required disabled={loading} rows={6}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7, opacity: loading ? 0.6 : 1 }}
                      onFocus={(e) => (e.target.style.borderColor = t.borderFocus)}
                      onBlur={(e) => (e.target.style.borderColor = t.border)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "12px",
                      border: "none",
                      background: loading ? t.bgSecondary : t.btnPrimary,
                      color: loading ? t.textMuted : t.btnPrimaryText,
                      fontSize: "14px",
                      fontWeight: 700,
                      fontFamily: "'Outfit', sans-serif",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = t.btnPrimaryHover; }}
                    onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = t.btnPrimary; }}
                  >
                    {loading ? "Sending..." : "Send message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}