import { Shield, ShieldAlert, AlertTriangle, CheckCircle, Loader2, Scan, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="flex flex-col h-full p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary" />
            Analysis Results
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered deepfake detection
          </p>
        </div>

        {!hasFile ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center bg-secondary/30 mb-6">
              <Shield className="w-14 h-14 text-muted-foreground/50" />
            </div>
            <p className="text-lg text-muted-foreground mb-2">No file selected</p>
            <p className="text-sm text-muted-foreground/70 max-w-[250px]">
              Upload an image or video on the left panel to start the analysis
            </p>
          </div>
        ) : isAnalyzing ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center bg-primary/10 mb-6 relative">
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" />
              <Loader2 className="w-14 h-14 text-primary animate-spin" />
            </div>
            <p className="text-lg text-foreground font-medium mb-2">Analyzing media...</p>
            <p className="text-sm text-muted-foreground">
              Running deepfake detection algorithms
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/70">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Processing neural network layers
            </div>
          </div>
        ) : verdict === null ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center bg-primary/10 mb-6 group-hover:scale-105 transition-transform">
              <Shield className="w-14 h-14 text-primary" />
            </div>
            <p className="text-lg text-foreground font-medium mb-2">Ready to analyze</p>
            <p className="text-sm text-muted-foreground mb-6">
              Click below to start the deepfake detection
            </p>
            <Button
              onClick={onAnalyze}
              size="lg"
              className="px-10 py-6 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
            >
              <Scan className="w-5 h-5 mr-2" />
              Start Analysis
            </Button>
          </div>
        ) : (
        <div className="flex-1 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Verdict Card */}
          <div
            className={cn(
              "p-6 border-2 rounded-xl transition-all",
              getVerdictBg()
            )}
          >
            <div className="flex items-center gap-4">
              {verdict === "REAL" ? (
                <div className="w-14 h-14 rounded-xl bg-[hsl(142,76%,36%/0.2)] flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[hsl(142,76%,36%)]" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8 text-destructive" />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                  Verdict
                </p>
                <p className={cn("text-3xl font-bold", getVerdictColor())}>
                  {verdict}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="p-5 bg-secondary/20 border border-border/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Confidence Score
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px]">How confident the AI is in its verdict. Higher is more certain.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {confidence.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Fake Probability */}
          <div className="p-5 bg-secondary/20 border border-border/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Fake Probability
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px]">Likelihood that the media has been artificially manipulated.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {probability.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700 ease-out", getProgressColor())}
                style={{ width: `${probability}%` }}
              />
            </div>
          </div>

          {/* Warning Banner */}
          {verdict === "FAKE" && confidence > 70 && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-destructive">
                  High Confidence Fake Detected
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  This media shows strong indicators of artificial manipulation
                </p>
              </div>
            </div>
          )}

          {/* Success Banner for Real */}
          {verdict === "REAL" && confidence > 70 && (
            <div className="p-4 bg-[hsl(142,76%,36%/0.1)] border border-[hsl(142,76%,36%/0.3)] rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,36%/0.2)] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-[hsl(142,76%,36%)]" />
              </div>
              <div>
                <p className="font-semibold text-[hsl(142,76%,36%)]">
                  Authentic Media Confirmed
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  No significant signs of manipulation detected
                </p>
              </div>
            </div>
          )}

          {/* Analyze Again Button */}
          <Button
            onClick={onAnalyze}
            variant="secondary"
            size="lg"
            className="mt-auto rounded-xl"
          >
            <Scan className="w-4 h-4 mr-2" />
            Analyze Again
          </Button>
        </div>
      )}
      </div>
    </TooltipProvider>
  );
};
