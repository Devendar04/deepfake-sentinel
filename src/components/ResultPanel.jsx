import { ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

export default function ResultPanel({
  result = {},
  hasFile,
  onAnalyze,
  hideAnalyzeButton = false,
}) {
  const {
    verdict = null,
    confidence = 0,
    probability = 0,
    isAnalyzing = false,
  } = result;

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-1">
          <span className="text-emerald-400">✦</span> Analysis Results
        </h2>
        <p className="text-sm text-white/60 mb-6">
          AI-powered deepfake detection
        </p>

        {/* NO FILE */}
        {!hasFile && (
          <div className="flex flex-col items-center justify-center text-center h-[300px] text-white/60">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>
            <p className="text-white font-medium">No file selected</p>
            <p className="text-sm">
              Upload an image or video to start the analysis
            </p>
          </div>
        )}

        {/* READY TO ANALYZE */}
        {hasFile && !isAnalyzing && !verdict && (
          <div className="flex flex-col items-center justify-center text-center h-[300px]">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse-slow">
              <ShieldCheck size={36} className="text-emerald-400" />
            </div>

            <p className="text-lg font-semibold">Ready to analyze</p>
            <p className="text-sm text-white/60">
              Click below to start deepfake detection
            </p>
          </div>
        )}

        {/* ANALYZING */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center text-center h-[300px]">
            <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-400" size={40} />
            </div>

            <p className="mt-4 font-medium">Analyzing Media</p>
            <p className="text-sm text-white/60">
              Running AI deepfake detection...
            </p>
          </div>
        )}

        {/* FINAL RESULT */}
        {verdict && !isAnalyzing && (
          <div className="space-y-6 animate-fade-in">
            {/* Verdict Card */}
            <div
              className={`p-5 rounded-xl flex items-center gap-4 border ${
                verdict === "FAKE"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-emerald-500/10 border-emerald-500/30"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  verdict === "FAKE"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                <AlertTriangle size={28} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Verdict
                </p>
                <p
                  className={`text-2xl font-bold ${
                    verdict === "FAKE"
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {verdict}
                </p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Confidence Score</span>
                <span className="font-semibold">
                  {confidence.toFixed(1)}%
                </span>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-1000"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>

            {/* Fake Probability */}
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Fake Probability</span>
                <span className="font-semibold">
                  {probability.toFixed(1)}%
                </span>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 transition-all duration-1000"
                  style={{ width: `${probability}%` }}
                />
              </div>
            </div>

            {/* Alert Box */}
            {verdict === "FAKE" && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
                ⚠ High Confidence Fake Detected — Strong indicators of manipulation.
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA BUTTON */}
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
