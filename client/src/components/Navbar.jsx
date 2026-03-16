import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LayoutDashboard, History, LogOut, Sun, Moon, Home } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, isDark, toggleTheme } = useTheme();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
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
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const initial  = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  const navLinks = [
    { to: "/",          label: "Home",      icon: <Home size={14} /> },
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
    { to: "/history",   label: "History",   icon: <History size={14} /> },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        margin: "16px 16px 0",
        borderRadius: "16px",
        background: t.navBg,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        fontFamily: "'Outfit', sans-serif",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="5,3 13,8 5,13" fill="#fff" />
              <rect x="2" y="11" width="7" height="1.8" rx="0.9" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "15px", color: t.text, letterSpacing: "-0.4px" }}>
            Note<span style={{ color: "#6366f1" }}>tube</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
                background: isActive(to) ? t.text : "transparent",
                color: isActive(to) ? t.bg : t.textSecondary,
              }}
              onMouseOver={(e) => {
                if (!isActive(to)) {
                  e.currentTarget.style.background = t.bgHover;
                  e.currentTarget.style.color = t.text;
                }
              }}
              onMouseOut={(e) => {
                if (!isActive(to)) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = t.textSecondary;
                }
              }}
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: `1px solid ${t.border}`,
              background: t.bgCard,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: t.textSecondary,
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = t.bgHover;
              e.currentTarget.style.color = t.text;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = t.bgCard;
              e.currentTarget.style.color = t.textSecondary;
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Avatar dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: `1px solid ${t.border}`,
                background: t.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.bg,
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "opacity 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {initial}
            </button>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "8px",
                  width: "200px",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                  borderRadius: "14px",
                  padding: "8px",
                  boxShadow: t.shadow,
                  zIndex: 100,
                }}
              >
                <div style={{ padding: "10px 12px", borderBottom: `1px solid ${t.border}`, marginBottom: "6px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: t.text, margin: 0 }}>{user?.name ?? "User"}</p>
                  <p style={{ fontSize: "11px", color: t.textMuted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email ?? ""}</p>
                </div>
                <Link to="/dashboard" style={{ textDecoration: "none" }} onClick={() => setShowDropdown(false)}>
                  <button
                    style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: "8px", border: "none", background: "transparent", fontSize: "13px", fontWeight: 600, color: t.text, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background 0.15s" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = t.bgHover)}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "8px", border: "none", background: "transparent", fontSize: "13px", fontWeight: 600, color: "#e53e3e", cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background 0.15s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = isDark ? "#2a0a0a" : "#fff5f5")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}