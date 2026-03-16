import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import {
  ArrowLeft,
  Youtube,
  CheckCircle2,
  FileText,
  Save,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

export default function SummaryDetail() {
  const [video, setVideo] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const { id } = useParams();
  // token is handled automatically by useApi interceptor
  const { t } = useTheme();
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await api.getVideoById(id);
      setVideo(res.data);
      setNotes(res.data.notes || "");
    } catch (err) {
      console.error(err);
      navigate("/history");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await api.updateNotes(id, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (!video) return;
    const topicsText = video.topics?.length > 0
      ? "\n\nTopics:\n" + video.topics.map((t, i) => `${i + 1}. ${t.title}\n${t.summary}`).join("\n\n")
      : "";
    const text = [
      video.title,
      "",
      "Summary:",
      video.summary,
      "",
      "Key Points:",
      ...(video.keyPoints?.map((p, i) => `${i + 1}. ${p}`) ?? []),
      topicsText,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f7f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit', sans-serif",
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
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
      </div>
    );
  }

  if (!video) return null;

  const tabs = [
    { key: "summary",   label: "Summary" },
    { key: "keypoints", label: "Key Points" },
    { key: "topics",    label: "Topics" },
    { key: "notes",     label: "My Notes" },
  ];

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
          maxWidth: "760px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            color: "#aaa",
            fontFamily: "'Outfit', sans-serif",
            marginBottom: "24px",
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#0a0a0a")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#aaa")}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* Video info card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "16px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
            {/* Thumbnail */}
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  width: "140px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  flexShrink: 0,
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "140px",
                  height: "90px",
                  borderRadius: "12px",
                  background: "#f7f7f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Youtube size={24} color="#ccc" />
              </div>
            )}

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#0a0a0a",
                  letterSpacing: "-0.3px",
                  marginBottom: "6px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.4,
                }}
              >
                {video.title || "Untitled Video"}
              </h1>
              <p
                style={{
                  fontSize: "13px",
                  color: "#aaa",
                  marginBottom: "12px",
                  fontWeight: 400,
                }}
              >
                {video.channel || "Unknown channel"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#0a0a0a",
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.6")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <ExternalLink size={12} />
                  Watch on YouTube
                </a>
                <span style={{ color: "#e0e0e0", fontSize: "12px" }}>·</span>
                <span style={{ fontSize: "12px", color: "#ccc", fontWeight: 500 }}>
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
                {video.isEducational && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px", background: "#f7f7f7", borderRadius: "100px", fontSize: "11px", fontWeight: 700, color: "#0a0a0a" }}>
                    📚 Study
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "14px",
          }}
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "8px 18px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === key ? "#0a0a0a" : "transparent",
                color: activeTab === key ? "#fff" : "#888",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => {
                if (activeTab !== key) {
                  e.currentTarget.style.background = "#f0f0f0";
                  e.currentTarget.style.color = "#0a0a0a";
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== key) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#888";
                }
              }}
            >
              {label}
            </button>
          ))}

          {/* Copy button — pushed to the right */}
          <button
            onClick={handleCopy}
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "1.5px solid #f0f0f0",
              background: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              color: copied ? "#22c55e" : "#888",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              if (!copied) e.currentTarget.style.borderColor = "#0a0a0a";
            }}
            onMouseOut={(e) => {
              if (!copied) e.currentTarget.style.borderColor = "#f0f0f0";
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Tab panels */}

        {/* Summary */}
        {activeTab === "summary" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0a0a0a",
                marginBottom: "16px",
              }}
            >
              <FileText size={15} color="#aaa" />
              Summary
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#444",
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              {video.summary}
            </p>
          </div>
        )}

        {/* Key Points */}
        {activeTab === "keypoints" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0a0a0a",
                marginBottom: "16px",
              }}
            >
              <CheckCircle2 size={15} color="#aaa" />
              Key Points
            </h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              {video.keyPoints?.length > 0 ? (
                video.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "7px",
                        background: "#f7f7f7",
                        border: "1px solid #f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#0a0a0a",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {index + 1}
                    </span>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#444",
                        lineHeight: 1.7,
                        fontWeight: 400,
                        margin: 0,
                      }}
                    >
                      {point}
                    </p>
                  </li>
                ))
              ) : (
                <p style={{ fontSize: "13px", color: "#bbb", fontWeight: 400 }}>
                  No key points available.
                </p>
              )}
            </ul>
          </div>
        )}

        {/* Topics */}
        {activeTab === "topics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Study mode badge */}
            {video.isEducational && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#0a0a0a", borderRadius: "12px" }}>
                <span style={{ fontSize: "14px" }}>📚</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Study Mode — topic notes extracted from this video</span>
              </div>
            )}

            {video.topics?.length > 0 ? (
              video.topics.map((topic, index) => (
                <div
                  key={index}
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "24px 28px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Topic header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "8px",
                        background: "#0a0a0a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </span>
                    <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0a0a0a", margin: 0, letterSpacing: "-0.3px" }}>
                      {topic.title}
                    </h3>
                  </div>

                  {/* Topic summary */}
                  <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.8, fontWeight: 400, margin: "0 0 16px", paddingLeft: "36px" }}>
                    {topic.summary}
                  </p>

                  {/* Per-topic notes — only for educational videos */}
                  {video.isEducational && topic.notes?.length > 0 && (
                    <div style={{ paddingLeft: "36px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#aaa", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Notes from video
                      </div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                        {topic.notes.map((note, ni) => (
                          <li
                            key={ni}
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                              padding: "10px 14px",
                              background: "#f7f7f7",
                              borderRadius: "10px",
                              fontSize: "13px",
                              color: "#444",
                              lineHeight: 1.6,
                              fontWeight: 400,
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0a0a0a", flexShrink: 0, marginTop: "6px" }} />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "48px 24px", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: "13px", color: "#bbb", fontWeight: 400 }}>
                  No topics available. Re-summarize the video to get topic breakdowns.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {activeTab === "notes" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0a0a0a",
                marginBottom: "16px",
              }}
            >
              <FileText size={15} color="#aaa" />
              My Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              rows={8}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1.5px solid #f0f0f0",
                background: "#f7f7f7",
                fontSize: "13px",
                color: "#0a0a0a",
                fontFamily: "'Outfit', sans-serif",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: 1.7,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0a0a0a")}
              onBlur={(e) => (e.target.style.borderColor = "#f0f0f0")}
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              style={{
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: saved ? "#f0fdf4" : saving ? "#e0e0e0" : "#0a0a0a",
                color: saved ? "#22c55e" : saving ? "#aaa" : "#fff",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (!saving && !saved) e.currentTarget.style.background = "#333";
              }}
              onMouseOut={(e) => {
                if (!saving && !saved) e.currentTarget.style.background = "#0a0a0a";
              }}
            >
              {saved ? (
                <><Check size={13} /> Saved!</>
              ) : (
                <><Save size={13} /> {saving ? "Saving..." : "Save Notes"}</>
              )}
            </button>
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