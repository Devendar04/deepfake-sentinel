import { Shield, ShieldAlert, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  verdict: "REAL" | "FAKE" | null;
  confidence: number;
  probability: number;
  isAnalyzing: boolean;
}

interface ResultPanelProps {
  result: AnalysisResult;
  hasFile: boolean;
  onAnalyze: () => void;
}

export const ResultPanel = ({ result, hasFile, onAnalyze }: ResultPanelProps) => {
  const { verdict, confidence, probability, isAnalyzing } = result;

  const getVerdictColor = () => {
    if (verdict === "REAL") return "text-[hsl(142,76%,36%)]";
    if (verdict === "FAKE") return "text-destructive";
    return "text-muted-foreground";
  };

  const getVerdictBg = () => {
    if (verdict === "REAL") return "bg-[hsl(142,76%,36%/0.1)] border-[hsl(142,76%,36%/0.3)]";
    if (verdict === "FAKE") return "bg-destructive/10 border-destructive/30";
    return "bg-secondary border-border";
  };

  const getProgressColor = () => {
    if (probability > 70) return "bg-destructive";
    if (probability > 40) return "bg-[hsl(38,92%,50%)]";
    return "bg-[hsl(142,76%,36%)]";
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Analysis Results
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered deepfake detection
        </p>
      </div>

      {!hasFile ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-24 h-24 flex items-center justify-center bg-secondary/50 mb-6">
            <Shield className="w-12 h-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-center">
            Upload an image or video to begin analysis
          </p>
        </div>
      ) : isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-24 h-24 flex items-center justify-center bg-primary/10 mb-6 animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <p className="text-foreground font-medium">Analyzing media...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Running deepfake detection algorithms
          </p>
        </div>
      ) : verdict === null ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-24 h-24 flex items-center justify-center bg-primary/10 mb-6">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <p className="text-foreground font-medium mb-4">Ready to analyze</p>
          <button
            onClick={onAnalyze}
            className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Start Analysis
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6">
          {/* Verdict Card */}
          <div
            className={cn(
              "p-6 border-2 transition-all",
              getVerdictBg()
            )}
          >
            <div className="flex items-center gap-4">
              {verdict === "REAL" ? (
                <CheckCircle className="w-12 h-12 text-[hsl(142,76%,36%)]" />
              ) : (
                <ShieldAlert className="w-12 h-12 text-destructive" />
              )}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Verdict
                </p>
                <p className={cn("text-3xl font-bold", getVerdictColor())}>
                  {verdict}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="p-6 bg-secondary/30 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Confidence Score
              </span>
              <span className="text-2xl font-bold text-foreground">
                {confidence.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Fake Probability */}
          <div className="p-6 bg-secondary/30 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Fake Probability
              </span>
              <span className="text-2xl font-bold text-foreground">
                {probability.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-secondary overflow-hidden">
              <div
                className={cn("h-full transition-all duration-500", getProgressColor())}
                style={{ width: `${probability}%` }}
              />
            </div>
          </div>

          {/* Warning Banner */}
          {verdict === "FAKE" && confidence > 70 && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">
                  High Confidence Fake Detected
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This media shows strong indicators of artificial manipulation
                </p>
              </div>
            </div>
          )}

          {/* Analyze Again Button */}
          <button
            onClick={onAnalyze}
            className="mt-auto px-8 py-3 bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors border border-border"
          >
            Analyze Again
          </button>
        </div>
      )}
    </div>
  );
};
