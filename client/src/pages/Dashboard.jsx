import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import Navbar from "../components/Navbar";
import { Link2, Sparkles, Clock, Trash2, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentVideos, setRecentVideos] = useState([]);
  const { t, isDark, toggleTheme } = useTheme();

  const { user } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentVideos();
  }, []);

  const fetchRecentVideos = async () => {
    try {
      const res = await api.getUserVideos();
      setRecentVideos(res.data.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await api.summarizeVideo(url);
      navigate(`/summary/${res.data.video.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to summarize video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.deleteVideo(id);
      setRecentVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <Navbar />

      <div
        className="dash-container"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Greeting */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: t.text,
              letterSpacing: "-1px",
              marginBottom: "6px",
            }}
          >
            Hello, {firstName} 👋
          </h1>
          <p style={{ fontSize: "14px", color: t.textMuted, fontWeight: 400 }}>
            Paste a YouTube URL and get an AI-powered summary instantly
          </p>
        </div>

        {/* URL Input Card */}
        <div
          style={{
            background: t.bgCard,
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "36px",
            boxShadow: t.shadow,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="dash-input-row" style={{ display: "flex", gap: "10px" }}>
              {/* Input wrapper */}
              <div style={{ flex: 1, position: "relative" }}>
                <Link2
                  size={15}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#bbb",
                  }}
                />
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    paddingLeft: "40px",
                    paddingRight: "16px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "12px",
                    border: `1.5px solid ${t.border}`,
                    background: t.bgInput,
                    fontSize: "13px",
                    color: t.text,
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0a0a0a")}
                  onBlur={(e) => (e.target.style.borderColor = "#f0f0f0")}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !url.trim()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "12px 22px",
                  borderRadius: "12px",
                  border: "none",
                  background: loading || !url.trim() ? "#e0e0e0" : "#0a0a0a",
                  color: loading || !url.trim() ? "#aaa" : "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: loading || !url.trim() ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!loading && url.trim())
                    e.currentTarget.style.background = "#333";
                }}
                onMouseOut={(e) => {
                  if (!loading && url.trim())
                    e.currentTarget.style.background = "#0a0a0a";
                }}
              >
                <Sparkles size={14} />
                {loading ? "Summarizing..." : "Summarize"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "#e53e3e",
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            )}

            {/* Loading indicator */}
            {loading && (
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  {[0, 150, 300].map((delay) => (
                    <div
                      key={delay}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#0a0a0a",
                        animation: "bounce 0.8s ease-in-out infinite",
                        animationDelay: `${delay}ms`,
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: "13px", color: "#888" }}>
                  Fetching transcript and summarizing with AI...
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Recent Summaries */}
        {recentVideos.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <Clock size={14} color="#aaa" />
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#0a0a0a",
                    margin: 0,
                  }}
                >
                  Recent summaries
                </h2>
              </div>
              <Link
                to="/history"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#888",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
              >
                View all <ChevronRight size={13} />
              </Link>
            </div>

            <div
              className="dash-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              {recentVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => navigate(`/summary/${video.id}`)}
                  className="dash-card"
                  style={{
                    background: t.bgCard,
                    borderRadius: "16px",
                    padding: "16px",
                    cursor: "pointer",
                    boxShadow: t.shadowCard,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    position: "relative",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)";
                    const btn = e.currentTarget.querySelector(".delete-btn");
                    if (btn) btn.style.opacity = "1";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                    const btn = e.currentTarget.querySelector(".delete-btn");
                    if (btn) btn.style.opacity = "0";
                  }}
                >
                  {/* Thumbnail */}
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "12px",
                        display: "block",
                      }}
                    />
                  )}

                  <h3
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: t.text,
                      marginBottom: "4px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.5,
                    }}
                  >
                    {video.title || "Untitled Video"}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#aaa",
                      marginBottom: "12px",
                      fontWeight: 400,
                    }}
                  >
                    {video.channel || "Unknown channel"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#ccc", fontWeight: 500 }}>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(e, video.id)}
                      style={{
                        opacity: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "5px",
                        borderRadius: "7px",
                        border: "none",
                        background: "transparent",
                        color: "#e53e3e",
                        cursor: "pointer",
                        transition: "background 0.15s, opacity 0.15s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#fff5f5")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {recentVideos.length === 0 && !loading && (
          <div
            style={{
              background: t.bgCard,
              borderRadius: "20px",
              padding: "64px 24px",
              textAlign: "center",
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: t.bgSecondary,
                border: `1.5px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Sparkles size={22} color="#bbb" />
            </div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: t.text,
                marginBottom: "6px",
              }}
            >
              No summaries yet
            </h3>
            <p style={{ fontSize: "13px", color: t.textMuted, fontWeight: 400 }}>
              Paste a YouTube URL above to get started
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @media (max-width: 768px) {
          .dash-container { padding: 24px 16px !important; }
          .dash-input-row { flex-direction: column !important; }
          .dash-input-row button { width: 100% !important; }
          .dash-grid { grid-template-columns: 1fr !important; }
          .dash-card { min-width: 0 !important; }
          .delete-btn { opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
}