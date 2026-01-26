import { Shield, Cpu } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            DeepFake Detector
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-Powered Media Analysis
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Cpu className="w-4 h-4 text-primary" />
        <span>Neural Network v2.4</span>
        <span className="w-2 h-2 bg-[hsl(142,76%,36%)] rounded-full animate-pulse" />
        <span className="text-[hsl(142,76%,36%)]">Online</span>
      </div>
    </header>
  );
};
