import { useRef, useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function WebcamPanel({ setResult }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);

  // Cleanup: stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  // Start Camera
  const startCamera = async () => {
    if (stream) return;

    const camStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    videoRef.current.srcObject = camStream;
    setStream(camStream);
  };

  // Capture 5s Video
  const startCapture = async () => {
    if (!stream || isRecording) return;

    setIsRecording(true);
    chunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const file = new File([blob], "webcam.webm", { type: "video/webm" });

      await sendToBackend(file);
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, 5000);
  };

  const sendToBackend = async (file) => {
    setResult((p) => ({ ...p, isAnalyzing: true, verdict: null }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/predict/video`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setResult({
        verdict: data.label,
        confidence: data.confidence,
        probability:
          data.label === "FAKE"
            ? data.confidence
            : 100 - data.confidence,
        isAnalyzing: false,
      });
    } catch (err) {
      console.error(err);
      alert("Webcam prediction failed");
      setResult((p) => ({ ...p, isAnalyzing: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Skeleton Placeholder */}
      {!stream && (
        <div className="relative rounded-xl border border-white/10 w-full h-[350px] bg-white/5 overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/50 via-black/10 to-zinc-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              📷
            </div>
            <p className="text-sm">Camera preview will appear here</p>
          </div>
        </div>
      )}

      {/* Webcam Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`rounded-xl border border-white/10 w-full h-[350px] object-cover ${
          stream ? "block" : "hidden"
        }`}
      />

      {/* Start Button */}
      {!stream && (
        <button
          onClick={startCamera}
          className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
        >
          Start Camera
        </button>
      )}

      {/* Capture Button */}
      {stream && (
        <button
          onClick={startCapture}
          disabled={isRecording}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-emerald-500 text-black hover:bg-emerald-400"
          }`}
        >
          {isRecording ? "Recording... (5 sec)" : "Capture 5s Video & Analyze"}
        </button>
      )}
    </div>
  );
}
