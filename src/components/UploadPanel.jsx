import { useState, useRef } from "react";
import { UploadCloud, ImageIcon, Video, X, FileWarning } from "lucide-react";

const MAX_SIZE_MB = 200;

export default function UploadPanel({ onFileSelect, selectedFile, previewUrl, fileType }) {
  const [dragActive, setDragActive] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    setSizeError(false);
    if (!file) { onFileSelect(null, null); return; }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setSizeError(true);
      return;
    }

    const type = file.type.startsWith("image") ? "image" : "video";
    onFileSelect(file, type);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const labelId = "upload-input";

  return (
    <div className="w-full">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
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
            Media Upload
          </h2>
        </div>

        {selectedFile && (
          <button
            onClick={() => { setSizeError(false); onFileSelect(null, null); }}
            className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <X size={13} /> CLEAR
          </button>
        )}
      </div>

      <p className="text-white/30 text-xs mb-5" style={{ fontFamily: "var(--font-mono)" }}>
        Accepts images and video files up to {MAX_SIZE_MB} MB
      </p>

      {/* Drop zone */}
      <div
        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-2 border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.15)]"
            : "border border-dashed border-[#2a2d35] hover:border-emerald-500/50"
        }`}
        style={{ height: "320px", background: "#0b0d11" }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        {/* Drag active overlay shimmer */}
        {dragActive && (
          <div className="absolute inset-0 animate-shimmer pointer-events-none z-10" />
        )}

        {/* Scan line (shows when no file selected) */}
        {!previewUrl && (
          <div
            className="absolute left-0 right-0 h-px bg-emerald-400/30 animate-scan-down pointer-events-none z-10"
            style={{ top: 0 }}
          />
        )}

        {/* Empty state */}
        {!previewUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div
              className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-5 transition-colors ${
                dragActive
                  ? "border-emerald-400/50 bg-emerald-500/10"
                  : "border-[#2a2d35] bg-white/[0.03]"
              }`}
            >
              <UploadCloud
                size={24}
                className={dragActive ? "text-emerald-400" : "text-white/30"}
              />
            </div>

            <p className="text-white/70 text-sm font-medium mb-1">
              {dragActive ? "Release to upload" : "Drag & drop your file here"}
            </p>
            <p className="text-emerald-500/60 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              or click to browse
            </p>

            <div className="flex gap-5 mt-6">
              {[
                { icon: ImageIcon, label: "JPG / PNG / WEBP" },
                { icon: Video, label: "MP4 / WEBM / MOV" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/20 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  <Icon size={13} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        {previewUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center p-3 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {fileType === "image" && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            )}
            {fileType === "video" && (
              <video
                src={previewUrl}
                controls
                className="max-h-full max-w-full rounded-lg"
              />
            )}
          </div>
        )}

        <input
          ref={inputRef}
          id={labelId}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={(e) => processFile(e.target.files?.[0])}
        />
      </div>

      {/* Size error */}
      {sizeError && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
          <FileWarning size={14} className="text-red-400 shrink-0" />
          <p className="text-red-300 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            FILE TOO LARGE — max {MAX_SIZE_MB} MB
          </p>
        </div>
      )}

      {/* File info */}
      {selectedFile && !sizeError && (
        <div
          className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl border border-[#1f2330] animate-fade-slide"
          style={{ background: "rgba(16,185,129,0.04)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg shrink-0">
              {fileType === "image"
                ? <ImageIcon size={16} className="text-emerald-400" />
                : <Video size={16} className="text-emerald-400" />}
            </div>
            <div className="truncate">
              <p className="text-white/80 text-sm truncate font-medium">{selectedFile.name}</p>
              <p
                className="text-white/30 text-xs mt-0.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {fileType?.toUpperCase()}
              </p>
            </div>
          </div>

          <span
            className="shrink-0 px-2.5 py-1 rounded-md text-emerald-400 border border-emerald-500/20 bg-emerald-500/8 text-xs"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            READY
          </span>
        </div>
      )}
    </div>
  );
}