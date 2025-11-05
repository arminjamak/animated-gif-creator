import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UploadIcon,
  FileIcon,
  XIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (file: File, preview: string) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export function FileUploader({
  onFileSelect,
  acceptedFormats = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "video/mp4",
    "video/quicktime",
  ],

  maxSizeMB = 100,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateFile = (file: File): boolean => {
    setError("");

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      setError(
        `Invalid file type. Accepted formats: ${acceptedFormats.join(", ")}`
      );
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  };

  const handleFile = useCallback(
    (file: File) => {
      if (!validateFile(file)) return;

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onFileSelect(file, result);
      };
      reader.readAsDataURL(file);
    },
    [onFileSelect, acceptedFormats, maxSizeMB]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setPreview("");
    setError("");
  }, []);

  const isVideo = selectedFile?.type.startsWith("video/");
  const isImage = selectedFile?.type.startsWith("image/");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-3">Upload File</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an image (PNG, JPG, GIF) or video file (MP4, MOV)
        </p>
      </div>

      {!selectedFile ? (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <UploadIcon className="w-8 h-8 text-muted-foreground" />
              </div>

              <div>
                <p className="text-lg font-medium mb-1">
                  Drop your file here, or browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: PNG, JPG, GIF, MP4, MOV (max {maxSizeMB}MB)
                </p>
              </div>

              <Button asChild>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept={acceptedFormats.join(",")}
                    onChange={handleFileInput}
                  />
                  Choose File
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {isImage && preview && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {isVideo && (
                  <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                    <VideoIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      {isVideo ? "Video" : "Image"} •{" "}
                      {selectedFile.type.split("/")[1].toUpperCase()}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    className="flex-shrink-0"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
