import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import Navbar from "../components/Navbar";
import { Search, Trash2, Clock, Youtube } from "lucide-react";

export default function History() {
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useTheme();

  // token is handled automatically by useApi interceptor
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter whenever search term or videos list changes
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(videos);
    } else {
      setFiltered(
        videos.filter(
          (v) =>
            v.title?.toLowerCase().includes(q) ||
            v.channel?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, videos]);

  const fetchVideos = async () => {
    try {
      const res = await api.getUserVideos();
      setVideos(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.deleteVideo(id);
      // Functional updates to keep both lists in sync
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: t.text,
              letterSpacing: "-1px",
              marginBottom: "6px",
            }}
          >
            History
          </h1>
          <p style={{ fontSize: "14px", color: t.textMuted, fontWeight: 400 }}>
            All your saved video summaries
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <Search
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
            type="text"
            placeholder="Search by title or channel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "42px",
              paddingRight: "16px",
              paddingTop: "12px",
              paddingBottom: "12px",
              borderRadius: "12px",
              border: `1.5px solid ${t.border}`,
              background: t.bgCard,
              fontSize: "13px",
              color: t.text,
              fontFamily: "'Outfit', sans-serif",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0a0a0a")}
            onBlur={(e) => (e.target.style.borderColor = "#f0f0f0")}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "80px 0",
            }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
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
          </div>
        )}

        {/* Results count */}
        {!loading && filtered.length > 0 && (
          <p
            style={{
              fontSize: "12px",
              color: "#bbb",
              fontWeight: 500,
              marginBottom: "14px",
            }}
          >
            {filtered.length} {filtered.length === 1 ? "summary" : "summaries"}
            {search.trim() ? ` for "${search.trim()}"` : ""}
          </p>
        )}

        {/* Video list */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/summary/${video.id}`)}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  gap: "16px",
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  alignItems: "flex-start",
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
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                      width: "120px",
                      height: "76px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      flexShrink: 0,
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "120px",
                      height: "76px",
                      borderRadius: "10px",
                      background: "#f7f7f7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Youtube size={20} color="#ccc" />
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0a0a0a",
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
                      marginBottom: "8px",
                      fontWeight: 400,
                    }}
                  >
                    {video.channel || "Unknown channel"}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#bbb",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.6,
                    }}
                  >
                    {video.summary}
                  </p>
                </div>

                {/* Right side — date + delete */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    flexShrink: 0,
                    height: "76px",
                  }}
                >
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
                    <Trash2 size={14} />
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      color: "#ccc",
                      fontWeight: 500,
                    }}
                  >
                    <Clock size={10} />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "64px 24px",
              textAlign: "center",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "#f7f7f7",
                border: "1.5px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Clock size={22} color="#ccc" />
            </div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#0a0a0a",
                marginBottom: "6px",
              }}
            >
              {search.trim() ? "No results found" : "No summaries yet"}
            </h3>
            <p style={{ fontSize: "13px", color: "#aaa", fontWeight: 400 }}>
              {search.trim()
                ? "Try a different search term"
                : "Go to the dashboard and summarize your first video"}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}