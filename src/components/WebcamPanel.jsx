import { useRef, useState, useEffect } from "react";
import { Camera, Circle, StopCircle } from "lucide-react";
import { API_BASE } from "@/config";

export default function WebcamPanel({ setResult }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  // Countdown timer during recording
  useEffect(() => {
    if (!isRecording) { setCountdown(0); return; }
    setCountdown(5);
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(iv); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isRecording]);

  const startCamera = async () => {
    if (stream) return;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = s;
      setStream(s);
    } catch {
      alert("Camera access denied.");
    }
  };

  const startCapture = async () => {
    if (!stream || isRecording) return;
    setIsRecording(true);
    chunksRef.current = [];

    const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      await sendToBackend(new File([blob], "webcam.webm", { type: "video/webm" }));
    };

    mr.start();
    setTimeout(() => { mr.stop(); setIsRecording(false); }, 5000);
  };

  const sendToBackend = async (file) => {
    setResult((p) => ({ ...p, isAnalyzing: true, verdict: null }));
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/predict/webcam`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setResult({
        verdict:    data.verdict,
        confidence: data.confidence,
        probability: data.probability,
        raw_score:  data.raw_score,
        threshold:  data.threshold,
        model_used: data.model_used,
        isAnalyzing: false,
      });
    } catch (err) {
      console.error(err);
      alert("Webcam prediction failed. Is the backend running?");
      setResult((p) => ({ ...p, isAnalyzing: false }));
    }
  };

  return (
    <div className="w-full">
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-emerald-400 text-xs font-bold tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [ 01 ]
        </span>
        <h2
          className="text-white text-lg font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Live Webcam
        </h2>
      </div>
      <p className="text-white/30 text-xs mb-5" style={{ fontFamily: "var(--font-mono)" }}>
        Capture a 5-second clip for analysis
      </p>

      {/* Video area */}
      <div className="relative rounded-xl overflow-hidden border border-[#1f2330]" style={{ height: "300px", background: "#0b0d11" }}>

        {/* Placeholder */}
        {!stream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
            <div className="w-14 h-14 border border-[#1f2330] rounded-xl flex items-center justify-center mb-3">
              <Camera size={22} className="text-white/20" />
            </div>
            <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
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
            {/* Red border pulse */}
            <div className="absolute inset-0 border-2 border-red-500/60 rounded-xl animate-pulse" />

            {/* REC indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-fade-pulse" />
              <span
                className="text-red-400 text-xs font-bold"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}
              >
                REC
              </span>
            </div>

            {/* Countdown */}
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span
                className="text-white text-sm font-bold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {countdown}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4 space-y-3">
        {!stream ? (
          <button
            onClick={startCamera}
            className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.03em" }}
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={startCapture}
            disabled={isRecording}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isRecording
                ? "bg-red-500/10 border border-red-500/30 text-red-400 cursor-not-allowed"
                : "bg-emerald-500 text-black hover:bg-emerald-400"
            }`}
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.03em" }}
          >
            {isRecording ? (
              <>
                <StopCircle size={15} className="animate-pulse" />
                Recording... ({countdown}s)
              </>
            ) : (
              <>
                <Circle size={15} />
                Capture & Analyze (5s)
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}