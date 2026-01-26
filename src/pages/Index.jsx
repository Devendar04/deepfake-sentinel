import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { UploadPanel } from "@/components/UploadPanel";
import { ResultPanel } from "@/components/ResultPanel";

// Mock detection functions (would connect to actual ML backend)
const mockPredictImage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));
  const isFake = Math.random() > 0.5;
  const confidence = 70 + Math.random() * 25;
  return {
    verdict: isFake ? "FAKE" : "REAL",
    confidence,
    probability: isFake ? confidence : 100 - confidence,
  };
};

const mockPredictVideo = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000));
  const isFake = Math.random() > 0.5;
  const confidence = 65 + Math.random() * 30;
  return {
    verdict: isFake ? "FAKE" : "REAL",
    confidence,
    probability: isFake ? confidence : 100 - confidence,
  };
};

const Index = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState({
    verdict: null,
    confidence: 0,
    probability: 0,
    isAnalyzing: false,
  });

  const handleFileSelect = useCallback((file, type) => {
    if (file) {
      setSelectedFile(file);
      setFileType(type);
      setPreviewUrl(URL.createObjectURL(file));
      setResult({
        verdict: null,
        confidence: 0,
        probability: 0,
        isAnalyzing: false,
      });
    } else {
      setSelectedFile(null);
      setFileType(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setResult({
        verdict: null,
        confidence: 0,
        probability: 0,
        isAnalyzing: false,
      });
    }
  }, [previewUrl]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !fileType) return;

    setResult((prev) => ({ ...prev, isAnalyzing: true, verdict: null }));

    try {
      const prediction = fileType === "image" 
        ? await mockPredictImage()
        : await mockPredictVideo();

      setResult({
        verdict: prediction.verdict,
        confidence: prediction.confidence,
        probability: prediction.probability,
        isAnalyzing: false,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setResult((prev) => ({ ...prev, isAnalyzing: false }));
    }
  }, [selectedFile, fileType]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background dark">
      <Header />
      
      <main className="flex-1 flex min-h-0">
        {/* Left Panel - Upload */}
        <div className="w-1/2 border-r border-border bg-card/30 min-h-0">
          <UploadPanel
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            fileType={fileType}
            previewUrl={previewUrl}
          />
        </div>

        {/* Right Panel - Results */}
        <div className="w-1/2 bg-card/30 min-h-0">
          <ResultPanel
            result={result}
            hasFile={!!selectedFile}
            onAnalyze={handleAnalyze}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
