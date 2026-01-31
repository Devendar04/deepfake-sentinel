import { UploadCloud, Image, Video, X } from "lucide-react";

export default function UploadPanel({
  onFileSelect,
  selectedFile,
  previewUrl,
  fileType,
}) {
  return (
    <div className="w-full ">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 ">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-emerald-400">✦</span> Media Upload
        </h2>

        {selectedFile && (
          <button
            onClick={() => onFileSelect(null, null)}
            className="flex items-center gap-1 text-sm text-white/60 hover:text-red-400 transition"
          >
            <X size={16} /> Clear
          </button>
        )}
      </div>

      <p className="text-sm text-white/60 mb-6">
        Upload an image or video for AI analysis
      </p>

      {/* Upload Box */}
      <label className="relative border border-dashed border-[#3f3f41] bg-[#0E1116] rounded-xl h-[340px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-400 transition overflow-hidden">

        {/* Empty State */}
        {!previewUrl && (
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mb-4">
              <UploadCloud size={32} className="text-white/70" />
            </div>

            <p className="text-white font-medium">
              Drag & drop your file
            </p>

            <p className="text-sm text-emerald-400">
              or click to browse
            </p>

            <div className="flex gap-6 mt-6 text-white/60">
              <span className="flex items-center gap-2">
                <Image size={18} /> Images
              </span>

              <span className="flex items-center gap-2">
                <Video size={18} /> Videos
              </span>
            </div>
          </div>
        )}

        {/* Preview */}
        {previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 animate-fade-in">
            {fileType === "image" && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            )}

            {fileType === "video" && (
              <video
                src={previewUrl}
                controls
                className="max-h-full max-w-full rounded-xl"
              />
            )}
          </div>
        )}

        <input
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const type = file.type.startsWith("image") ? "image" : "video";
            onFileSelect(file, type);
          }}
        />
      </label>

      {/* File Info Panel */}
      {selectedFile && (
        <div className="mt-4 bg-white/5 border border-[#3f3f41] rounded-xl p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              {fileType === "image" ? (
                <Image className="text-emerald-400" size={20} />
              ) : (
                <Video className="text-emerald-400" size={20} />
              )}
            </div>

            <div className="truncate">
              <p className="text-sm font-medium truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-white/50">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                {fileType?.toUpperCase()}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
            Ready
          </span>
        </div>
      )}
    </div>
  );
}
