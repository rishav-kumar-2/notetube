import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError("");
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "32px", textDecoration: "none" }}
        >
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="5,3 13,8 5,13" fill="#fff" />
              <rect x="2" y="11" width="7" height="1.8" rx="0.9" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.5px" }}>
            Note<span style={{ color: "#6366f1" }}>tube</span>
          </span>
        </Link>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "36px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#0a0a0a",
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#aaa",
              fontWeight: 400,
              marginBottom: "28px",
            }}
          >
            Sign in to your account
          </p>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "#fff5f5",
                border: "1px solid #fed7d7",
                color: "#e53e3e",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #f0f0f0",
                  background: "#f7f7f7",
                  fontSize: "13px",
                  color: "#0a0a0a",
                  fontFamily: "'Outfit', sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  opacity: loading ? 0.6 : 1,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0a0a0a")}
                onBlur={(e) => (e.target.style.borderColor = "#f0f0f0")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 16px",
                    borderRadius: "12px",
                    border: "1.5px solid #f0f0f0",
                    background: "#f7f7f7",
                    fontSize: "13px",
                    color: "#0a0a0a",
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0a0a0a")}
                  onBlur={(e) => (e.target.style.borderColor = "#f0f0f0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#bbb",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    transition: "color 0.15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#bbb")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "12px",
                border: "none",
                background: loading ? "#e0e0e0" : "#0a0a0a",
                color: loading ? "#aaa" : "#fff",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.background = "#333";
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.background = "#0a0a0a";
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#aaa",
              marginTop: "24px",
              fontWeight: 400,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#0a0a0a",
                fontWeight: 700,
                textDecoration: "none",
              }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "13px",
            color: "#bbb",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#bbb",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#0a0a0a")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#bbb")}
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}