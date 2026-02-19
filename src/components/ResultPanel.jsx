// ResultPanel.jsx
import React, { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

/* CircularGauge
   - value: number 0..100
   - size: px
   - strokeWidth: px
   - color: CSS color
   - label: string (display under gauge)
*/
function CircularGauge({ value = 0, size = 120, strokeWidth = 10, color = "#10b981", label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // simple animation: step value using requestAnimationFrame to let CSS transitions run
    let raf;
    const start = performance.now();
    const duration = 700;
    const from = animatedValue;
    const to = safeValue;

    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // easeInOutQuad-ish
      setAnimatedValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeValue]);

  const dashOffset = circumference * (1 - animatedValue / 100);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <circle
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.9,.2,1)" }}
            transform="rotate(-90)"
          />
        </g>
      </svg>

      <div className="mt-2 text-center">
        <div className="text-lg font-semibold">{animatedValue.toFixed(1)}%</div>
        {label && <div className="text-xs text-white/60">{label}</div>}
      </div>
    </div>
  );
}

/* RiskPill */
function RiskPill({ probability = 0 }) {
  const p = Math.max(0, Math.min(100, Number(probability) || 0));
  let label = "Low";
  let bg = "bg-emerald-500/10";
  let text = "text-emerald-300";
  if (p > 70) {
    label = "High";
    bg = "bg-red-500/10";
    text = "text-red-300";
  } else if (p > 40) {
    label = "Medium";
    bg = "bg-amber-500/10";
    text = "text-amber-300";
  }
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg}`}>
      <span className={`text-sm font-semibold ${text}`}>{label} risk</span>
    </div>
  );
}

/* Helper to normalize backend values:
   Accepts 0..1 or 0..100 and returns 0..100 (number).
*/
const normalizePct = (v) => {
  const n = Number(v);
  if (!isFinite(n)) return 0;
  return n <= 1 ? n * 100 : n;
};

export default function ResultPanel({
  result = {},
  hasFile,
  onAnalyze,
  hideAnalyzeButton = false,
}) {
  // destructure and provide defaults
  const {
    verdict = null,
    confidence = 0,
    probability = 0,
    raw_score = null,
    threshold = null,
    model_used = "",
    isAnalyzing = false,
  } = result;

  const confPct = Math.max(0, Math.min(100, normalizePct(confidence)));
  const probPct = Math.max(0, Math.min(100, normalizePct(probability)));

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-1">
          <span className="text-emerald-400">✦</span> Analysis Results
        </h2>

        <p className="text-sm text-white/60 mb-6">AI-powered deepfake detection</p>

        {/* No file */}
        {!hasFile && (
          <div className="flex flex-col items-center justify-center text-center h-[300px] text-white/60">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>
            <p className="mt-3 font-medium">No file selected</p>
            <p className="text-sm">Upload an image or video to start analysis</p>
          </div>
        )}

        {/* Analyzing */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center text-center h-[300px]">
            <Loader2 className="animate-spin text-emerald-400" size={40} />
            <p className="mt-4 font-medium">Analyzing Media</p>
            <p className="text-sm text-white/60">Running AI deepfake detection...</p>
          </div>
        )}

        {/* Final result */}
        {verdict && !isAnalyzing && (
          <div className="space-y-6 animate-fade-in">

            {/* Verdict + Risk */}
            <div
              className={`p-5 rounded-xl flex items-center justify-between gap-4 border ${
                verdict === "FAKE"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-emerald-500/10 border-emerald-500/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    verdict === "FAKE" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {verdict === "FAKE" ? <AlertTriangle size={26} /> : <ShieldCheck size={26} />}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/50">Verdict</p>
                  <p className={`text-2xl font-bold ${verdict === "FAKE" ? "text-red-400" : "text-emerald-400"}`}>
                    {verdict}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RiskPill probability={probPct} />
              </div>
            </div>

            {/* Gauges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center">
                <CircularGauge value={confPct} size={120} strokeWidth={12} color="#10b981" label="Confidence" />
              </div>

              <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center">
                <CircularGauge value={probPct} size={120} strokeWidth={12} color="#ef4444" label="Fake Probability" />
              </div>
            </div>

            {/* Alert */}
            {verdict === "FAKE" && probPct > 70 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
                ⚠ High Confidence Fake Detected — Strong indicators of manipulation.
              </div>
            )}

            {/* Metadata / parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/5 p-3 rounded-lg text-sm">
                <div className="text-white/60 text-xs">Raw Score</div>
                <div className="font-medium">{raw_score ?? "—"}</div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg text-sm">
                <div className="text-white/60 text-xs">Threshold</div>
                <div className="font-medium">{threshold ?? "—"}</div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg text-sm">
                <div className="text-white/60 text-xs">Model Used</div>
                <div className="font-medium">{model_used || "—"}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      {!hideAnalyzeButton && (
        <button
          onClick={onAnalyze}
          disabled={!hasFile || isAnalyzing}
          className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing..." : "Start Analysis"}
        </button>
      )}
    </div>
  );
}
