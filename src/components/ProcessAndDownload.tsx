import { useState, useEffect } from "react";
import { DeviceMockup } from "../App";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { processMedia } from "../utils/mediaProcessor";

type ProcessAndDownloadProps = {
  device: DeviceMockup;
  uploadedFile: {
    file: File;
    url: string;
    type: "image" | "video" | "gif";
    croppedArea: { x: number; y: number; width: number; height: number } | null;
  };
  onBack: () => void;
  onStartOver: () => void;
};

export function ProcessAndDownload({
  device,
  uploadedFile,
  onBack,
  onStartOver,
}: ProcessAndDownloadProps) {
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [movBlob, setMovBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processContent();
  }, [device, uploadedFile]);

  const processContent = async () => {
    setProcessing(true);
    setProgress(0);
    setStatus("Initializing...");
    setError(null);

    try {
      const result = await processMedia({
        device,
        uploadedFile,
        onProgress: (prog, stat) => {
          setProgress(prog);
          setStatus(stat);
        },
      });

      setGifBlob(result.gifBlob);
      setMovBlob(result.movBlob);
      setPreviewUrl(result.previewUrl);
      setProcessing(false);
    } catch (err) {
      console.error("Error processing media:", err);
      setError(err instanceof Error ? err.message : "An error occurred during processing");
      setProcessing(false);
    }
  };

  const handleDownloadGif = () => {
    if (gifBlob) {
      const url = URL.createObjectURL(gifBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `device-shot-${Date.now()}.gif`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadMov = () => {
    if (movBlob) {
      const url = URL.createObjectURL(movBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `device-shot-${Date.now()}.mov`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-[80px]">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[16px] rounded-2xl p-8">
          <h2 className="text-white text-3xl mb-6 text-center font-[Inter] text-[24px]">
            {processing ? "Processing..." : "Your Device Shot is Ready!"}
          </h2>

          {error ? (
            <div className="mb-8">
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
                <p className="text-red-400 text-lg mb-2">Processing Error</p>
                <p className="text-white/60">{error}</p>
                <Button
                  onClick={onBack}
                  className="mt-4 bg-white text-black hover:bg-white/90"
                >
                  Go Back
                </Button>
              </div>
            </div>
          ) : processing ? (
            <div className="mb-8">
              <div className="flex flex-col items-center justify-center h-[600px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-6"></div>
                <div className="w-full max-w-md">
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden mb-4">
                    <div
                      className="bg-white h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-center text-lg">{status}</p>
                  <p className="text-white/60 text-center mt-2">{progress}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              {gifBlob && (
                <div className="bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(gifBlob)}
                    alt="Processed result"
                    className="max-w-full max-h-[600px] object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {!processing && !error && (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleDownloadGif}
                disabled={!gifBlob}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="mr-2 size-4" />
                Download GIF
              </Button>
              <Button
                onClick={handleDownloadMov}
                disabled={!movBlob || movBlob.size === 0}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!movBlob || movBlob.size === 0 ? "MOV generation requires FFmpeg (not available)" : ""}
              >
                <Download className="mr-2 size-4" />
                Download MOV
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}