import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const GITHUB_REPO = "Devendar04/deepfake-sentinel";
const GITHUB_URL  = `https://github.com/${GITHUB_REPO}`;
const HF_URL      = "https://huggingface.co/Devendra174/deepfake-detection-xception-vit";
const FD = "var(--font-display)";
const FM = "var(--font-mono)";

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
    </svg>
  );
}
function GithubIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}
function PlayIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  );
}
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

const FEATURES = [
  { title: "Image analysis",     desc: "Upload JPG, PNG, or WEBP. Keras-powered face detection returns a verdict in under a second.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { title: "Video detection",    desc: "Samples keyframes with MTCNN face extraction, then runs XceptionViT for temporal analysis.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> },
  { title: "Live webcam",        desc: "Capture a 5-second clip directly from your browser camera and analyze in real time.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg> },
  { title: "Confidence scores",  desc: "Not just FAKE / REAL — raw score, threshold, confidence percentage and risk level all returned.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { title: "FastAPI backend",    desc: "RESTful API with three endpoints — image, video, and webcam. CORS-ready for any frontend.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> },
  { title: "HuggingFace models", desc: "Models hosted on HuggingFace Hub — auto-downloaded on first deploy, cached for subsequent requests.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
];

const STEPS = [
  { num: "[ 01 ]", title: "Drop your media",  desc: "Upload an image or video, or activate your webcam. Supports JPG, PNG, MP4, WEBM up to 200 MB." },
  { num: "[ 02 ]", title: "Neural inference", desc: "MTCNN extracts faces from each frame. XceptionViT processes spatial + temporal features through a transformer encoder." },
  { num: "[ 03 ]", title: "Forensic result",  desc: "Get FAKE or REAL verdict with confidence score, fake probability, risk level, and raw model output." },
];

const TECH = ["PyTorch","TensorFlow / Keras","XceptionViT","MTCNN","timm","FastAPI","React + Vite","Tailwind CSS","HuggingFace Hub","Render","Vercel","FaceForensics++"];

/* ── Animated orb background for sections ─────────────────
   Uses hardcoded emerald/indigo so it looks vivid on both themes */
function OrbBackground({ orb1Color, orb2Color, orb3Color, style }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0, ...style }}>
      <div className="orb orb-1" style={{ width: 480, height: 480, background: orb1Color, top: "-20%", left: "-10%" }} />
      <div className="orb orb-2" style={{ width: 400, height: 400, background: orb2Color, bottom: "-15%", right: "-8%" }} />
      <div className="orb orb-3" style={{ width: 300, height: 300, background: orb3Color, top: "40%", left: "50%", transform: "translateX(-50%)" }} />
    </div>
  );
}

/* ── Small card orb — for feature / step cards ───────────── */
function CardOrb({ color, style }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: 200, height: 200,
        borderRadius: "50%",
        background: color,
        filter: "blur(60px)",
        opacity: 0.35,
        ...style,
      }}
    />
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [stars, setStars] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then(r => r.json())
      .then(d => { if (d.stargazers_count !== undefined) setStars(d.stargazers_count); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 backdrop-blur-xl"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--nav-bg)", transition: "background 0.3s" }}>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
            <ShieldIcon />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-fade-pulse" />
          </div>
          <div>
            <p style={{ fontFamily: FD, fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>DEEPFAKE SENTINEL</p>
            <p style={{ fontFamily: FM, fontSize: 10, color: "rgba(16,185,129,0.6)", letterSpacing: "0.06em", marginTop: 2 }}>NEURAL FORENSICS ENGINE</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} title={dark ? "Light mode" : "Dark mode"}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:text-emerald-400"
            style={{ border: "1px solid var(--border2)", background: "transparent", color: "var(--text-faint)", cursor: "pointer" }}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:text-emerald-400"
            style={{ border: "1px solid var(--border2)", color: "var(--text-dim)", background: "transparent", textDecoration: "none" }}>
            <GithubIcon /> GitHub
          </a>
          <button onClick={() => navigate("/app")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:bg-emerald-400"
            style={{ background: "#10b981", color: "#000", border: "none", fontFamily: FD, letterSpacing: "0.02em", cursor: "pointer" }}>
            <PlayIcon size={14} /> Launch App
          </button>
        </div>
      </nav>

      {/* ── Hero — with animated orbs ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Orbs sit behind content */}
        <OrbBackground
          orb1Color="rgba(16,185,129,0.18)"
          orb2Color="rgba(99,102,241,0.15)"
          orb3Color="rgba(16,185,129,0.10)"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", fontFamily: FM, fontSize: 11, color: "#10b981", letterSpacing: "0.08em" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-fade-pulse" />
            NEURAL FORENSICS · XCEPTIONVIT · REAL-TIME
          </div>

          <h1 className="font-black leading-none mb-6"
            style={{ fontFamily: FD, fontSize: "clamp(48px,9vw,96px)", letterSpacing: "-0.03em", color: "var(--text)" }}>
            Detect <span style={{ color: "#10b981" }}>Deepfakes</span>
            <br />
            <span style={{ color: "var(--text-faint)" }}>in seconds.</span>
          </h1>

          <p className="mb-12 max-w-lg" style={{ color: "var(--text-dim)", fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.7, fontWeight: 300 }}>
            AI-powered forensic analysis for images and videos. Upload any media and get instant verdict — powered by XceptionViT neural architecture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <button onClick={() => navigate("/app")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:bg-emerald-400 hover:-translate-y-0.5"
              style={{ background: "#10b981", color: "#000", border: "none", fontFamily: FD, letterSpacing: "0.02em", cursor: "pointer" }}>
              <PlayIcon size={16} /> Try it free
            </button>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer"
              className="flex rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
              style={{ border: "1px solid var(--border2)", textDecoration: "none" }}>
              <div className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold"
                style={{ background: "var(--surface2)", color: "var(--text)", borderRight: "1px solid var(--border2)", fontFamily: FD }}>
                <GithubIcon size={15} />
                Star on GitHub
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div className="flex items-center px-4 py-3.5"
                style={{ background: "var(--surface)", color: "var(--text-dim)", fontFamily: FM, fontSize: 12 }}>
                {stars !== null ? stars.toLocaleString() : "—"}
              </div>
            </a>
          </div>

          {/* ── Demo window — terminal titlebar always black ── */}
          <div className="w-full max-w-3xl">
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border2)", background: "var(--surface)" }}>

              {/* Titlebar — hardcoded black regardless of theme */}
              <div className="flex items-center gap-2 px-4 py-3"
                style={{ background: "#111318", borderBottom: "1px solid #1e2230" }}>
                <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                <span className="flex-1 text-center" style={{ fontFamily: FM, fontSize: 11, letterSpacing: "0.04em", color: "rgba(255,255,255,0.30)" }}>
                  deepfake-sentinel.vercel.app
                </span>
              </div>

              {/* Panels */}
              <div className="grid grid-cols-2" style={{ gap: 1, background: "var(--border)" }}>
                {/* Upload */}
                <div className="p-6" style={{ background: "var(--surface)" }}>
                  <p style={{ fontFamily: FM, fontSize: 10, color: "#10b981", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>[ 01 ]</p>
                  <p style={{ fontFamily: FD, fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Media Upload</p>
                  <div className="flex flex-col items-center justify-center rounded-xl relative overflow-hidden"
                    style={{ border: "1px dashed var(--border2)", height: 140, background: "var(--dropzone-bg)" }}>
                    <div className="absolute left-0 right-0 h-px animate-scan-down" style={{ background: "var(--scan-color)" }} />
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                      style={{ border: "1px solid var(--border2)", background: "var(--surface2)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text-faint)" }}>
                        <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-dim)" }}>Drop image or video</p>
                    <p style={{ fontFamily: FM, fontSize: 10, color: "rgba(16,185,129,0.6)", marginTop: 4 }}>or click to browse</p>
                  </div>
                </div>

                {/* Result */}
                <div className="p-6" style={{ background: "var(--surface)" }}>
                  <p style={{ fontFamily: FM, fontSize: 10, color: "#10b981", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>[ 02 ]</p>
                  <p style={{ fontFamily: FD, fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Analysis Results</p>
                  <div className="rounded-xl p-4 mb-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)" }}>
                    <p style={{ fontFamily: FM, fontSize: 9, color: "rgba(239,68,68,0.6)", letterSpacing: "0.1em", marginBottom: 2 }}>VERDICT</p>
                    <p style={{ fontFamily: FD, fontSize: 30, fontWeight: 800, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1 }}>FAKE</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ color: "#10b981", label: "Confidence", pct: "81.6%", offset: 32 }, { color: "#ef4444", label: "Fake prob.", pct: "82.1%", offset: 31 }].map(g => (
                      <div key={g.label} className="flex flex-col items-center py-3 rounded-lg"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                        <svg width="64" height="64" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="24" fill="none" style={{ stroke: "var(--gauge-track)" }} strokeWidth="6"/>
                          <circle cx="32" cy="32" r="24" fill="none" stroke={g.color} strokeWidth="6" strokeLinecap="round"
                            strokeDasharray="150.8" strokeDashoffset={g.offset} transform="rotate(-90 32 32)"/>
                          <text x="32" y="32" textAnchor="middle" dominantBaseline="central"
                            fill={g.color} fontFamily="'JetBrains Mono',monospace" fontSize="11" fontWeight="500">{g.pct}</text>
                        </svg>
                        <p style={{ fontFamily: FM, fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{g.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ background: "var(--border)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", gap: 1 }}>
        {[{ num: "XceptionViT", label: "Architecture" }, { num: "3", label: "Detection modes" }, { num: "0.5s", label: "Image inference" }, { num: "100%", label: "Free & open source" }].map(s => (
          <div key={s.label} className="py-8 text-center" style={{ background: "var(--bg)" }}>
            <p style={{ fontFamily: FD, fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#10b981", lineHeight: 1, marginBottom: 8 }}>{s.num}</p>
            <p style={{ fontFamily: FM, fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Features — each card has a subtle orb ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 py-24">
        <p style={{ fontFamily: FM, fontSize: 11, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12 }}>CAPABILITIES</p>
        <h2 style={{ fontFamily: FD, fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>Built for forensic-grade detection</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 17, fontWeight: 300, lineHeight: 1.7, maxWidth: 500, marginBottom: 48 }}>Every component designed for accuracy — from face extraction to transformer-based temporal analysis.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden" style={{ gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}>
          {FEATURES.map((f, i) => {
            const orbColors = ["rgba(16,185,129,0.12)", "rgba(99,102,241,0.12)", "rgba(16,185,129,0.10)", "rgba(245,158,11,0.10)", "rgba(16,185,129,0.12)", "rgba(99,102,241,0.10)"];
            return (
              <div key={f.title} className="p-8 transition-colors relative overflow-hidden"
                style={{ background: "var(--surface)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; }}>
                {/* Card orb */}
                <CardOrb color={orbColors[i % orbColors.length]} style={{ top: -60, right: -60 }} />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ border: "1px solid var(--border2)", background: "rgba(16,185,129,0.07)" }}>
                    {f.icon}
                  </div>
                  <p style={{ fontFamily: FD, fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{f.title}</p>
                  <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Steps — orb per card ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 pb-24">
        <p style={{ fontFamily: FM, fontSize: 11, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12 }}>HOW IT WORKS</p>
        <h2 style={{ fontFamily: FD, fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 48 }}>Three steps to a verdict</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <div key={s.num} className="p-8 rounded-2xl relative overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400/40" />
              <CardOrb
                color={["rgba(16,185,129,0.14)","rgba(99,102,241,0.12)","rgba(16,185,129,0.12)"][i]}
                style={{ bottom: -80, right: -80 }}
              />
              <div className="relative z-10">
                <p style={{ fontFamily: FM, fontSize: 11, color: "#10b981", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14 }}>{s.num}</p>
                <p style={{ fontFamily: FD, fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{s.title}</p>
                <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.65, fontWeight: 300 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech stack ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 pb-24">
        <p style={{ fontFamily: FM, fontSize: 11, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12 }}>TECH STACK</p>
        <h2 style={{ fontFamily: FD, fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 32 }}>Built with</h2>
        <div className="flex flex-wrap gap-2">
          {TECH.map(tech => (
            <div key={tech} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--text-dim)", fontFamily: FM, fontSize: 12, cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.color = "#10b981"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text-dim)"; }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />{tech}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA — with orbs ── */}
      <div className="mx-6 sm:mx-12 mb-24 rounded-2xl p-16 text-center relative overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}>
        <CardOrb color="rgba(16,185,129,0.16)" style={{ top: -80, left: -80, width: 300, height: 300 }} />
        <CardOrb color="rgba(99,102,241,0.14)" style={{ bottom: -80, right: -80, width: 280, height: 280 }} />
        <div className="relative z-10">
          <h2 style={{ fontFamily: FD, fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>
            Start detecting deepfakes now
          </h2>
          <p style={{ color: "var(--text-dim)", fontWeight: 300, fontSize: 17, marginBottom: 40 }}>Free, open source, no account needed.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate("/app")}
              className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-base transition-all hover:bg-emerald-400 hover:-translate-y-0.5"
              style={{ background: "#10b981", color: "#000", border: "none", fontFamily: FD, letterSpacing: "0.02em", cursor: "pointer" }}>
              <PlayIcon size={16} /> Launch App
            </button>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
              style={{ border: "1px solid var(--border2)", color: "var(--text)", fontFamily: FD, letterSpacing: "0.02em", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}>
              <GithubIcon size={16} /> ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-12 py-8"
        style={{ borderTop: "1px solid var(--border)" }}>
        <p style={{ fontFamily: FM, fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.06em" }}>
          DEEPFAKE SENTINEL · FOR RESEARCH & EDUCATIONAL USE ONLY
        </p>
        <div className="flex items-center gap-6">
          {[{ label: "GitHub", href: GITHUB_URL }, { label: "HuggingFace", href: HF_URL }].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              style={{ fontFamily: FM, fontSize: 11, letterSpacing: "0.04em", color: "var(--text-faint)", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#10b981"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-faint)"; }}>
              {l.label}
            </a>
          ))}
          <button onClick={() => navigate("/app")}
            style={{ fontFamily: FM, fontSize: 11, letterSpacing: "0.04em", color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#10b981"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-faint)"; }}>
            Launch App
          </button>
        </div>
      </footer>
    </div>
  );
}