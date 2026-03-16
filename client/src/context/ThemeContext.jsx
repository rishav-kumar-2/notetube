import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Restore from localStorage on first load
    return localStorage.getItem("theme") ?? "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Apply to document root so CSS variables work globally if needed
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const isDark = theme === "dark";

  // Design tokens — all components read from here
  const t = isDark
    ? {
        bg:          "#0a0a0a",
        bgSecondary: "#141414",
        bgCard:      "#1a1a1a",
        bgHover:     "#222",
        bgInput:     "#1e1e1e",
        border:      "#2a2a2a",
        borderFocus: "#fff",
        text:        "#fff",
        textSecondary: "#aaa",
        textMuted:   "#555",
        navBg:       "rgba(10,10,10,0.92)",
        btnPrimary:  "#fff",
        btnPrimaryText: "#0a0a0a",
        btnPrimaryHover: "#e0e0e0",
        btnSecondaryBorder: "#333",
        invertedBg:  "#fff",
        invertedText: "#0a0a0a",
        shadow:      "0 2px 16px rgba(0,0,0,0.4)",
        shadowCard:  "0 2px 12px rgba(0,0,0,0.5)",
      }
    : {
        bg:          "#f7f7f7",
        bgSecondary: "#f0f0f0",
        bgCard:      "#fff",
        bgHover:     "#f5f5f5",
        bgInput:     "#f7f7f7",
        border:      "#f0f0f0",
        borderFocus: "#0a0a0a",
        text:        "#0a0a0a",
        textSecondary: "#555",
        textMuted:   "#aaa",
        navBg:       "rgba(255,255,255,0.92)",
        btnPrimary:  "#0a0a0a",
        btnPrimaryText: "#fff",
        btnPrimaryHover: "#333",
        btnSecondaryBorder: "#e0e0e0",
        invertedBg:  "#0a0a0a",
        invertedText: "#fff",
        shadow:      "0 2px 16px rgba(0,0,0,0.06)",
        shadowCard:  "0 2px 12px rgba(0,0,0,0.05)",
      };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
