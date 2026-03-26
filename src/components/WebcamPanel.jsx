import { useRef, useState, useEffect } from "react";
import { Camera, Circle, StopCircle } from "lucide-react";
import { API_BASE } from "@/config";

// ── WebcamPanel always uses dark/black colors regardless of theme.
// Camera viewfinder is a physical dark display — it never goes cream.

export default function WebcamPanel({ setResult }) {
  const videoRef         = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream]           = useState(null);
  const [countdown, setCountdown]     = useState(0);

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  useEffect(() => {
    if (!isRecording) { setCountdown(0); return; }
    setCountdown(5);
    const iv = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(iv);
  }, [isRecording]);

  const startCamera = async () => {
    if (stream) return;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = s;
      setStream(s);
    } catch { alert("Camera access denied."); }
  };

  const startCapture = async () => {
    if (!stream || isRecording) return;
    setIsRecording(true);
    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mr;
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      await sendToBackend(new File([blob], "webcam.webm", { type: "video/webm" }));
    };
    mr.start();
    setTimeout(() => { mr.stop(); setIsRecording(false); }, 5000);
  };

  const sendToBackend = async (file) => {
    setResult(p => ({ ...p, isAnalyzing: true, verdict: null }));
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/predict/webcam`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setResult({ verdict: data.verdict, confidence: data.confidence, probability: data.probability,
        raw_score: data.raw_score, threshold: data.threshold, model_used: data.model_used, isAnalyzing: false });
    } catch (err) {
      console.error(err);
      alert(err.message?.includes("503")
        ? "Backend is still loading models. Try again in ~2 minutes."
        : "Webcam prediction failed.");
      setResult(p => ({ ...p, isAnalyzing: false }));
    }
  };

  return (
    <div className="w-full">
      {/* Header — uses theme vars (text in panel header is fine) */}
      <div className="flex items-center gap-2 mb-1">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#10b981", fontWeight: 700, letterSpacing: "0.1em" }}>
          [ 01 ]
        </span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
          Live Webcam
        </h2>
      </div>
      <p className="mb-5" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)" }}>
        Capture a 5-second clip for analysis
      </p>

      {/* ── Video area — ALWAYS dark, hardcoded, never changes on theme ── */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          height: 300,
          background: "#0a0c12",        /* hardcoded near-black */
          border: "1px solid #1e2230",  /* hardcoded dark border */
        }}
      >
        {/* Placeholder */}
        {!stream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ border: "1px solid #2a2d3e" /* hardcoded */ }}
            >
              <Camera size={22} style={{ color: "rgba(255,255,255,0.25)" /* hardcoded */ }} />
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.35)" /* hardcoded */ }}>
              Camera preview will appear here
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay muted playsInline
          className={`w-full h-full object-cover ${stream ? "block" : "hidden"}`}
        />

        {/* Recording overlay */}
        {isRecording && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-red-500/60 rounded-xl animate-pulse" />
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
              style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-fade-pulse" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#f87171", letterSpacing: "0.1em", fontWeight: 700 }}>
                REC
              </span>
            </div>
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {countdown}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4">
        {!stream ? (
          <button
            onClick={startCamera}
            className="w-full py-3 rounded-xl font-bold text-sm transition-colors hover:bg-emerald-400"
            style={{ background: "#10b981", color: "#000", border: "none", fontFamily: "var(--font-display)", letterSpacing: "0.03em", cursor: "pointer" }}
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={startCapture}
            disabled={isRecording}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            style={{
              fontFamily: "var(--font-display)", letterSpacing: "0.03em",
              cursor: isRecording ? "not-allowed" : "pointer",
              background: isRecording ? "rgba(239,68,68,0.10)" : "#10b981",
              color: isRecording ? "#f87171" : "#000",
              border: isRecording ? "1px solid rgba(239,68,68,0.35)" : "none",
            }}
          >
            {isRecording
              ? <><StopCircle size={15} className="animate-pulse" /> Recording... ({countdown}s)</>
              : <><Circle size={15} /> Capture &amp; Analyze (5s)</>
            }
          </button>
        )}
      </div>
    </div>
  );
}