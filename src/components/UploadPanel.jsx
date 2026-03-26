import { useState, useRef } from "react";
import { UploadCloud, ImageIcon, Video, X, FileWarning } from "lucide-react";

const MAX_SIZE_MB = 200;

export default function UploadPanel({ onFileSelect, selectedFile, previewUrl, fileType }) {
  const [dragActive, setDragActive] = useState(false);
  const [sizeError, setSizeError]   = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    setSizeError(false);
    if (!file) { onFileSelect(null, null); return; }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) { setSizeError(true); return; }
    onFileSelect(file, file.type.startsWith("image") ? "image" : "video");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#10b981", fontWeight: 700, letterSpacing: "0.1em" }}>
            [ 01 ]
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
            Media Upload
          </h2>
        </div>
        {selectedFile && (
          <button
            onClick={() => { setSizeError(false); onFileSelect(null, null); }}
            className="flex items-center gap-1 text-xs transition-colors hover:text-red-400"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={13} /> CLEAR
          </button>
        )}
      </div>

      <p className="mb-5" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)" }}>
        Accepts images and video files up to {MAX_SIZE_MB} MB
      </p>

      {/* Drop zone */}
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
        style={{
          height: 320,
          background: "var(--dropzone-bg)",
          border: dragActive ? "2px solid #10b981" : "1px dashed var(--border2)",
          boxShadow: dragActive ? "0 0 24px rgba(16,185,129,0.12)" : "none",
        }}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={e => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        {dragActive && <div className="absolute inset-0 animate-shimmer pointer-events-none z-10" />}

        {!previewUrl && (
          <div className="absolute left-0 right-0 h-px animate-scan-down pointer-events-none z-10"
            style={{ top: 0, background: "var(--scan-color)" }} />
        )}

        {/* Empty state */}
        {!previewUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors"
              style={{
                border: dragActive ? "1px solid rgba(16,185,129,0.5)" : "1px solid var(--border2)",
                background: dragActive ? "rgba(16,185,129,0.08)" : "var(--surface2)",
              }}
            >
              <UploadCloud size={24} style={{ color: dragActive ? "#10b981" : "var(--text-faint)" }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text-dim)" }}>
              {dragActive ? "Release to upload" : "Drag & drop your file here"}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(16,185,129,0.6)" }}>
              or click to browse
            </p>
            <div className="flex gap-5 mt-6">
              {[{ icon: ImageIcon, label: "JPG / PNG / WEBP" }, { icon: Video, label: "MP4 / WEBM / MOV" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)" }}>
                  <Icon size={13} />{label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        {previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center p-3 animate-fade-in"
            onClick={e => e.stopPropagation()}>
            {fileType === "image" && <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />}
            {fileType === "video" && <video src={previewUrl} controls className="max-h-full max-w-full rounded-lg" />}
          </div>
        )}

        <input ref={inputRef} type="file" hidden accept="image/*,video/*"
          onChange={e => processFile(e.target.files?.[0])} />
      </div>

      {/* Size error */}
      {sizeError && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg animate-fade-in"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <FileWarning size={14} className="text-red-400 shrink-0" />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f87171" }}>
            FILE TOO LARGE — max {MAX_SIZE_MB} MB
          </p>
        </div>
      )}

      {/* File info card */}
      {selectedFile && !sizeError && (
        <div
          className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl animate-fade-slide"
          style={{ background: "rgba(16,185,129,0.05)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg shrink-0"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              {fileType === "image"
                ? <ImageIcon size={16} className="text-emerald-400" />
                : <Video size={16} className="text-emerald-400" />}
            </div>
            <div className="truncate">
              <p className="text-sm truncate font-medium" style={{ color: "var(--text)" }}>{selectedFile.name}</p>
              <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)" }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {fileType?.toUpperCase()}
              </p>
            </div>
          </div>
          <span
            className="shrink-0 px-2.5 py-1 rounded-md text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.08)" }}
          >
            READY
          </span>
        </div>
      )}
    </div>
  );
}