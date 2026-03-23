import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import UploadPanel from "@/components/UploadPanel";
import ResultPanel from "@/components/ResultPanel";
import WebcamPanel from "@/components/WebcamPanel";
import { API_BASE } from "@/config";

const EMPTY_RESULT = {
  verdict: null,
  confidence: 0,
  probability: 0,
  raw_score: 0,
  threshold: 0,
  model_used: "",
  isAnalyzing: false,
};

export default function Index() {
  const [mode, setMode] = useState("upload");
  const [apiOnline, setApiOnline] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(EMPTY_RESULT);

  // Check API health on mount
  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then((r) => setApiOnline(r.ok))
      .catch(() => setApiOnline(false));
  }, []);

  // Reset on mode switch
  useEffect(() => {
    setResult(EMPTY_RESULT);
    setSelectedFile(null);
    setFileType(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [mode]);

  const handleFileSelect = useCallback(
    (file, type) => {
      if (file) {
        setSelectedFile(file);
        setFileType(type);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setSelectedFile(null);
        setFileType(null);
        previewUrl && URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setResult(EMPTY_RESULT);
    },
    [previewUrl]
  );

  const predict = async (endpoint, file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}${endpoint}`, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    return res.json();
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !fileType) return;
    setResult((p) => ({ ...p, isAnalyzing: true, verdict: null }));
    try {
      const data =
        fileType === "image"
          ? await predict("/predict/image", selectedFile)
          : await predict("/predict/video", selectedFile);

      setResult({
        verdict: data.verdict,
        confidence: data.confidence,
        probability: data.probability,
        raw_score: data.raw_score,
        threshold: data.threshold,
        model_used: data.model_used,
        isAnalyzing: false,
      });
    } catch (err) {
      console.error(err);
      setApiOnline(false);
      alert("Prediction failed. Is the backend running?");
      setResult((p) => ({ ...p, isAnalyzing: false }));
    }
  };

  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="min-h-screen grid-bg text-white" style={{ background: "var(--bg)" }}>
      <Header apiOnline={apiOnline} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Mode switcher */}
        <div className="flex justify-center mb-8">
          <div
            className="flex p-1 rounded-xl border border-[#1f2330]"
            style={{ background: "var(--surface)" }}
          >
            {["upload", "webcam"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-emerald-500 text-black"
                    : "text-white/40 hover:text-white/70"
                }`}
                style={
                  mode === m
                    ? { fontFamily: "var(--font-display)", letterSpacing: "0.02em" }
                    : {}
                }
              >
                {m === "upload" ? "Upload Media" : "Live Webcam"}
              </button>
            ))}
          </div>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="bracket-panel rounded-2xl p-7 border border-[#1f2330]"
            style={{ background: "var(--surface)" }}
          >
            {mode === "upload" ? (
              <UploadPanel
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                fileType={fileType}
              />
            ) : (
              <WebcamPanel setResult={setResult} active={mode === "webcam"} />
            )}
          </div>

          <div
            className="bracket-panel rounded-2xl p-7 border border-[#1f2330]"
            style={{ background: "var(--surface)" }}
          >
            <ResultPanel
              result={result}
              hasFile={!!selectedFile || mode === "webcam"}
              onAnalyze={mode === "upload" ? handleAnalyze : null}
              hideAnalyzeButton={mode === "webcam"}
            />
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-8 text-white/15"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em" }}
        >
          DEEPFAKE SENTINEL · FOR RESEARCH & EDUCATIONAL USE ONLY
        </p>
      </main>
    </div>
  );
}