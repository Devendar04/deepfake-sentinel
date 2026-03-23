import { ShieldCheck } from "lucide-react";

export default function Header({ apiOnline = true }) {
  return (
    <header className="border-b border-[#1f2330] bg-[#0b0d11]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-fade-pulse" />
          </div>

          <div>
            <h1
              className="text-white leading-none tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              DEEPFAKE SENTINEL
            </h1>
            <p
              className="text-emerald-500/60 mt-0.5"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
            >
              NEURAL FORENSICS ENGINE
            </p>
          </div>
        </div>

        {/* Right — status */}
        <div className="flex items-center gap-6">
          <div
            className="hidden sm:flex items-center gap-4 text-white/20"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
          >
            <span>XceptionViT</span>
            <span className="w-px h-3 bg-white/10" />
            <span>THRESHOLD 0.50</span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
              apiOnline
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                : "border-red-500/20 bg-red-500/5 text-red-400"
            }`}
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                apiOnline ? "bg-emerald-400 animate-fade-pulse" : "bg-red-400"
              }`}
            />
            {apiOnline ? "API ONLINE" : "API OFFLINE"}
          </div>
        </div>
      </div>

      {/* Thin progress-style accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </header>
  );
}