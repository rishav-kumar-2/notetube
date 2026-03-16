import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you could send this to a logging service like Sentry
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#f7f7f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Outfit', sans-serif",
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "48px",
              textAlign: "center",
              maxWidth: "440px",
              width: "100%",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#0a0a0a",
                letterSpacing: "-0.5px",
                marginBottom: "8px",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#888",
                fontWeight: 400,
                marginBottom: "28px",
                lineHeight: 1.6,
              }}
            >
              An unexpected error occurred. Please try refreshing the page or go back to the dashboard.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 22px",
                  borderRadius: "100px",
                  border: "1.5px solid #e0e0e0",
                  background: "#fff",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "#0a0a0a",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#0a0a0a")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
              >
                Refresh page
              </button>
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "100px",
                    border: "none",
                    background: "#0a0a0a",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "#0a0a0a")}
                >
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}