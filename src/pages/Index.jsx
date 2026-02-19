import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import UploadPanel from "@/components/UploadPanel";
import ResultPanel from "@/components/ResultPanel";
import WebcamPanel from "@/components/WebcamPanel";

const API_BASE = "http://127.0.0.1:8000";

export default function Index() {
  const [mode, setMode] = useState("upload"); // upload | webcam

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState({
    verdict: null,
    confidence: 0,
    probability: 0,
    raw_score: 0,
    threshold: 0,
    model_used: "",
    isAnalyzing: false,
  });
  useEffect(() => {
    setResult({
      verdict: null,
      confidence: 0,
      probability: 0,
      isAnalyzing: false,
    });

    setSelectedFile(null);
    setFileType(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [mode]);
  // Handle file select
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

    // Reset result safely
    setResult({
      verdict: null,
      confidence: 0,
      probability: 0,
      raw_score: 0,
      threshold: 0,
      model_used: "",
      isAnalyzing: false,
    });
  },
  [previewUrl]
);


  // Predict image
  const predictImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/predict/image`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Image prediction failed");
    return await res.json();
  };

  // Predict video
  const predictVideo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/predict/video`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Video prediction failed");
    return await res.json();
  };

  // Run analysis
 const handleAnalyze = async () => {
  if (!selectedFile || !fileType) return;

  setResult((p) => ({ ...p, isAnalyzing: true, verdict: null }));

  try {
    const prediction =
      fileType === "image"
        ? await predictImage(selectedFile)
        : await predictVideo(selectedFile);

    console.log("API RESPONSE:", prediction); // debug

    setResult({
      verdict: prediction.verdict,   // ✅ FIXED
      confidence: prediction.confidence,
      probability: prediction.probability,
      raw_score: prediction.raw_score,
      threshold: prediction.threshold,
      model_used: prediction.model_used,
      isAnalyzing: false,
    });

  } catch (err) {
    console.error("Prediction error:", err);
    alert("Prediction failed. Check backend server.");
    setResult((p) => ({ ...p, isAnalyzing: false }));
  }
};


  // Cleanup preview
  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="min-h-screen bg-[#0E1116] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Mode Switch */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("upload")}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              mode === "upload"
                ? "bg-emerald-500 text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Upload Media
          </button>

          <button
            onClick={() => setMode("webcam")}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              mode === "webcam"
                ? "bg-emerald-500 text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Live Webcam
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-[#3f3f41]">
          {/* LEFT PANEL */}
          <div className="bg-[#24262b66] border-[#3f3f41] rounded-2xl p-8 shadow-2xl">

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

          {/* RIGHT PANEL */}
         <div className="bg-[#24262b66]  border-[#3f3f41] rounded-2xl p-8 shadow-2xl">
            <ResultPanel
              result={result}
              hasFile={!!selectedFile || mode === "webcam"}
              onAnalyze={mode === "upload" ? handleAnalyze : null}
              hideAnalyzeButton={mode === "webcam"}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
