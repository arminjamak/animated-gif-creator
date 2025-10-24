import { useState, useCallback, useRef } from "react";
import { DeviceMockup } from "../App";
import { Button } from "./ui/button";
import { Upload, ArrowLeft, Crop } from "lucide-react";
import { CropTool } from "./CropTool";

type FileUploadProps = {
  device: DeviceMockup;
  onUpload: (
    file: File,
    url: string,
    type: "image" | "video" | "gif",
    croppedArea: { x: number; y: number; width: number; height: number } | null
  ) => void;
  onBack: () => void;
};

export function FileUpload({ device, onUpload, onBack }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    url: string;
    type: "image" | "video" | "gif";
  } | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const getFileType = (file: File): "image" | "video" | "gif" => {
    if (file.type.startsWith("video/")) return "video";
    if (file.type === "image/gif") return "gif";
    return "image";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const type = getFileType(file);
    setSelectedFile({ file, url, type });
    setShowCrop(true);
  };

  const handleCropComplete = (croppedArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null) => {
    if (selectedFile) {
      onUpload(selectedFile.file, selectedFile.url, selectedFile.type, croppedArea);
    }
  };

  const handleSkipCrop = () => {
    if (selectedFile) {
      onUpload(selectedFile.file, selectedFile.url, selectedFile.type, null);
    }
  };

  if (showCrop && selectedFile) {
    return (
      <CropTool
        fileUrl={selectedFile.url}
        fileType={selectedFile.type}
        onComplete={handleCropComplete}
        onSkip={handleSkipCrop}
        onBack={() => {
          setShowCrop(false);
          setSelectedFile(null);
        }}
      />
    );
  }

  if (selectedFile) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-[80px]">
        <div className="w-full max-w-[900px] mx-auto">
          <Button
            onClick={() => setSelectedFile(null)}
            variant="ghost"
            className="mb-6 text-white hover:text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 size-4" />
            Choose Different File
          </Button>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <h2 className="text-white text-3xl mb-6 text-center">Preview Your File</h2>

            <div className="bg-black rounded-lg overflow-hidden mb-6 max-h-[500px] flex items-center justify-center">
              {selectedFile.type === "video" ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="max-w-full max-h-[500px]"
                />
              ) : (
                <img
                  src={selectedFile.url}
                  alt="Preview"
                  className="max-w-full max-h-[500px] object-contain"
                />
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowCrop(true)}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Crop className="mr-2 size-4" />
                Crop & Continue
              </Button>
              <Button
                onClick={handleSkipCrop}
                className="bg-white text-black hover:bg-white/90"
              >
                Skip Crop & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-[80px]">
      <div className="w-full max-w-[900px] mx-auto">
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[16px] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl mb-2 font-[Inter] text-[24px]">Upload Your Content</h2>
            <p className="text-white/60 font-[Inter]">
              Supports .gif, .jpg, .png, and video files
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative group cursor-pointer" onClick={onBack}>
              <img
                src={device.image}
                alt={device.name}
                className="w-64 h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button className="bg-white text-black hover:bg-white/90">
                  Change
                </Button>
              </div>
            </div>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-4 border-dashed rounded-2xl p-16 text-center transition-all ${
              dragActive
                ? "border-white bg-white/20 scale-105"
                : "border-white/30 hover:border-white/50"
            }`}
          >
            <Upload className="size-16 text-white/60 mx-auto mb-4" />
            <p className="text-white text-xl mb-2 font-[Inter] text-[16px]">
              Drag and drop your file here
            </p>
            <p className="text-white/60 mb-6 font-[Inter]">or</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black hover:bg-white/90"
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.gif"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}