import { ShieldCheck } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
    </svg>
  );
}

export default function Header({ apiOnline = true }) {
  const { dark, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--nav-bg)",
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="relative w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}
          >
            <ShieldCheck size={18} className="text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-fade-pulse" />
          </div>

          <div>
            <h1
              className="leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)" }}
            >
              DEEPFAKE SENTINEL
            </h1>
            <p
              className="mt-0.5"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.05em", color: "rgba(16,185,129,0.6)" }}
            >
              NEURAL FORENSICS ENGINE
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Metadata (hidden on mobile) */}
          <div
            className="hidden sm:flex items-center gap-4"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)" }}
          >
            <span>XceptionViT</span>
            <span className="w-px h-3" style={{ background: "var(--border2)" }} />
            <span>THRESHOLD 0.50</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:text-emerald-400"
            style={{
              border: "1px solid var(--border2)",
              background: "transparent",
              color: "var(--text-dim)",
              cursor: "pointer",
            }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* API status */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              border: apiOnline ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(239,68,68,0.2)",
              background: apiOnline ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)",
              color: apiOnline ? "#10b981" : "#ef4444",
            }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${apiOnline ? "animate-fade-pulse" : ""}`}
              style={{ background: apiOnline ? "#10b981" : "#ef4444" }}
            />
            {apiOnline ? "API ONLINE" : "API OFFLINE"}
          </div>
        </div>
      </div>

      <div
        className="h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent)" }}
      />
    </header>
  );
}