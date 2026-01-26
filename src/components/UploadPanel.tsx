import { useState, useCallback, useRef } from "react";
import { Upload, Image, Video, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Media Upload
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload an image or video for AI analysis
            </p>
          </div>
          {selectedFile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove file and start over</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300",
              "bg-secondary/20 hover:bg-secondary/40 cursor-pointer group",
              isDragOver
                ? "border-primary bg-primary/10 scale-[1.02]"
                : "border-border/50 hover:border-primary/50"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-5 p-8">
              <div
                className={cn(
                  "w-24 h-24 rounded-2xl flex items-center justify-center bg-secondary/50 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110",
                  isDragOver && "bg-primary/30 scale-110"
                )}
              >
                <Upload
                  className={cn(
                    "w-12 h-12 text-muted-foreground transition-all duration-300 group-hover:text-primary",
                    isDragOver && "text-primary"
                  )}
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg text-foreground font-medium">
                  {isDragOver ? "Drop it here!" : "Drag & drop your file"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or <span className="text-primary underline underline-offset-2 cursor-pointer">click to browse</span>
                </p>
              </div>
              <div className="flex items-center gap-6 mt-4 px-6 py-3 bg-secondary/30 rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-help">
                      <Image className="w-5 h-5 text-primary/70" />
                      <span>Images</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Supports JPG, PNG, WEBP formats</p>
                  </TooltipContent>
                </Tooltip>
                <div className="w-px h-5 bg-border" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-help">
                      <Video className="w-5 h-5 text-primary/70" />
                      <span>Videos</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Supports MP4, MOV, AVI formats</p>
                  </TooltipContent>
                </Tooltip>
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
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1 flex items-center justify-center bg-secondary/20 border border-border/50 rounded-xl overflow-hidden min-h-0">
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
            <div className="mt-4 p-4 bg-secondary/30 border border-border/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  fileType === "image" ? "bg-primary/10" : "bg-primary/10"
                )}>
                  {fileType === "image" ? (
                    <Image className="w-5 h-5 text-primary" />
                  ) : (
                    <Video className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {fileType?.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary">Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
