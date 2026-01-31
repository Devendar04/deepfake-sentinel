import { ShieldCheck, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-[#3f3f41] bg-[#0E1116] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <ShieldCheck className="text-black" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-white">
              DeepFake Detector
            </h1>
            <p className="text-sm text-white/60">AI-Powered Media Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Settings size={16} />

          <span className="text-zinc-400">Neural Network v2.4</span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-fade-pulse "></span>
            <span className="ml-1" >Online</span>
          </span>
        </div>
      </div>
    </header>
  );
}
