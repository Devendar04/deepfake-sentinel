import { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, Loader2, ScanLine } from "lucide-react";

function CircularGauge({ value = 0, size = 110, strokeWidth = 9, color, label }) {
  const radius        = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safe          = Math.max(0, Math.min(100, Number(value) || 0));
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now(), dur = 800, from = animated;
    const step = t => {
      const p = Math.min(1, (t - start) / dur);
      const e = p < .5 ? 2*p*p : -1+(4-2*p)*p;
      setAnimated(from + (safe - from) * e);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [safe]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size/2},${size/2})`}>
          {/* track — uses CSS variable via style prop */}
          <circle r={radius} fill="none" style={{ stroke: "var(--gauge-track)" }} strokeWidth={strokeWidth} />
          <circle
            r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - animated / 100)}
            style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.9,.2,1)", filter: `drop-shadow(0 0 5px ${color}55)` }}
            transform="rotate(-90)"
          />
        </g>
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central"
          fill={color} style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 500 }}>
          {animated.toFixed(1)}%
        </text>
      </svg>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

const norm = v => { const n = Number(v); return isFinite(n) ? (n <= 1 ? n*100 : n) : 0; };

function riskLevel(p) {
  if (p > 70) return { label: "HIGH",   color: "#ef4444", bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.25)" };
  if (p > 40) return { label: "MEDIUM", color: "#f59e0b", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)" };
  return             { label: "LOW",    color: "#10b981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.25)" };
}

export default function ResultPanel({ result = {}, hasFile, onAnalyze, hideAnalyzeButton = false }) {
  const { verdict=null, confidence=0, probability=0, raw_score=null, threshold=null, model_used="", isAnalyzing=false } = result;
  const confPct = Math.max(0, Math.min(100, norm(confidence)));
  const probPct = Math.max(0, Math.min(100, norm(probability)));
  const isFake  = verdict === "FAKE";
  const risk    = riskLevel(probPct);

  return (
    <div className="h-full flex flex-col justify-between gap-6">
      <div className="flex-1">

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#10b981", fontWeight: 700, letterSpacing: "0.1em" }}>
            [ 02 ]
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
            Analysis Results
          </h2>
        </div>
        <p className="mb-6" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)" }}>
          AI-powered deepfake detection output
        </p>

        {/* Empty */}
        {!hasFile && !isAnalyzing && !verdict && (
          <div className="flex flex-col items-center justify-center h-72 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
              style={{ border: "1px solid var(--border)" }}>
              <ShieldCheck size={28} style={{ color: "var(--text-faint)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-dim)" }}>Awaiting input</p>
            <p className="text-xs mt-1" style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)" }}>
              Upload or capture media to begin
            </p>
          </div>
        )}

        {/* Analyzing */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-72 text-center">
            <div className="relative w-16 h-16 mb-5">
              <div className="absolute inset-0 border border-emerald-500/20 rounded-xl animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine size={28} className="text-emerald-400 animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-dim)" }}>
              Analyzing
            </p>
            <p className="text-xs animate-fade-pulse" style={{ fontFamily: "var(--font-mono)", color: "rgba(16,185,129,0.5)" }}>
              Running neural forensics...
            </p>
          </div>
        )}

        {/* Result */}
        {verdict && !isAnalyzing && (
          <div className="space-y-5 animate-verdict">

            {/* Verdict banner */}
            <div className="relative overflow-hidden rounded-xl p-5"
              style={{ background: isFake ? "rgba(239,68,68,0.07)" : "rgba(16,185,129,0.07)", border: `1px solid ${isFake ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}` }}>
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: isFake ? "radial-gradient(ellipse at top left,rgba(239,68,68,0.3),transparent 60%)" : "radial-gradient(ellipse at top left,rgba(16,185,129,0.3),transparent 60%)" }} />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: isFake ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)" }}>
                    {isFake ? <AlertTriangle size={22} className="text-red-400" /> : <ShieldCheck size={22} className="text-emerald-400" />}
                  </div>
                  <div>
                    <p className="text-xs uppercase mb-0.5" style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)", letterSpacing: "0.1em" }}>
                      Verdict
                    </p>
                    <p className="text-3xl font-black leading-none"
                      style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: isFake ? "#ef4444" : "#10b981" }}>
                      {verdict}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ fontFamily: "var(--font-mono)", color: risk.color, background: risk.bg, border: `1px solid ${risk.border}`, letterSpacing: "0.08em" }}>
                  {risk.label} RISK
                </div>
              </div>
            </div>

            {/* Gauges */}
            <div className="grid grid-cols-2 gap-4">
              {[{ value: confPct, color: "#10b981", label: "Confidence" }, { value: probPct, color: "#ef4444", label: "Fake probability" }].map(g => (
                <div key={g.label} className="flex flex-col items-center py-5 rounded-xl"
                  style={{ border: "1px solid var(--border)", background: "var(--surface2)" }}>
                  <CircularGauge value={g.value} color={g.color} label={g.label} />
                </div>
              ))}
            </div>

            {/* High-confidence alert */}
            {isFake && probPct > 70 && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl animate-fade-slide"
                style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-mono)", color: "#f87171" }}>
                  HIGH CONFIDENCE FAKE — strong manipulation signatures detected.
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "RAW SCORE", value: raw_score != null ? Number(raw_score).toFixed(4) : "—" },
                { label: "THRESHOLD", value: threshold != null ? threshold : "—" },
                { label: "MODEL",     value: model_used || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="px-3 py-2.5 rounded-lg"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <p className="mb-1" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {label}
                  </p>
                  <p className="text-xs font-medium truncate" style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analyze button */}
      {!hideAnalyzeButton && (
        <button
          onClick={onAnalyze}
          disabled={!hasFile || isAnalyzing}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            fontFamily: "var(--font-display)", letterSpacing: "0.04em",
            background: hasFile && !isAnalyzing ? "#10b981" : "var(--surface2)",
            color: hasFile && !isAnalyzing ? "#000" : "var(--text-faint)",
            border: hasFile && !isAnalyzing ? "none" : "1px solid var(--border)",
            cursor: hasFile && !isAnalyzing ? "pointer" : "not-allowed",
          }}
        >
          {isAnalyzing
            ? <span className="flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" /> Analyzing...</span>
            : "Run Analysis"
          }
        </button>
      )}
    </div>
  );
}