import { useState, useCallback, useRef } from "react";
import { Upload, Image, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadPanelProps {
  onFileSelect: (file: File | null, type: "image" | "video") => void;
  selectedFile: File | null;
  fileType: "image" | "video" | null;
  previewUrl: string | null;
}

export const UploadPanel = ({
  onFileSelect,
  selectedFile,
  fileType,
  previewUrl,
}: UploadPanelProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [onFileSelect]
  );

  const processFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (isImage) {
      onFileSelect(file, "image");
    } else if (isVideo) {
      onFileSelect(file, "video");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    onFileSelect(null, "image");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Media Upload
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload an image or video for analysis
          </p>
        </div>
        {selectedFile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex-1 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300",
            "bg-secondary/30 hover:bg-secondary/50 cursor-pointer",
            isDragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4 p-8">
            <div
              className={cn(
                "w-20 h-20 flex items-center justify-center bg-secondary transition-colors",
                isDragOver && "bg-primary/20"
              )}
            >
              <Upload
                className={cn(
                  "w-10 h-10 text-muted-foreground transition-colors",
                  isDragOver && "text-primary"
                )}
              />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">
                Drop your file here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Image className="w-4 h-4" />
                <span>JPG, PNG, WEBP</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Video className="w-4 h-4" />
                <span>MP4, MOV, AVI</span>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex items-center justify-center bg-secondary/30 border border-border overflow-hidden min-h-0">
            {fileType === "image" && previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            )}
            {fileType === "video" && previewUrl && (
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          <div className="mt-4 p-4 bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              {fileType === "image" ? (
                <Image className="w-5 h-5 text-primary" />
              ) : (
                <Video className="w-5 h-5 text-primary" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                  {fileType?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
