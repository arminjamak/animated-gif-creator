import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DeviceSelector } from "@/polymet/components/device-selector";
import { FileUploader } from "@/polymet/components/file-uploader";
import { ImageCropper } from "@/polymet/components/image-cropper";
import { MockupPreview } from "@/polymet/components/mockup-preview";
import { ProcessingIndicator } from "@/polymet/components/processing-indicator";
import { DownloadButton } from "@/polymet/components/download-button";
import { type DeviceMockup } from "@/polymet/data/device-mockups-integrated";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  CheckIcon,
  RefreshCwIcon,
  VideoIcon,
} from "lucide-react";

type WorkflowStep =
  | "device"
  | "upload"
  | "uploading"
  | "crop"
  | "preview"
  | "process"
  | "download";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function MockupGenerator() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("device");
  const [selectedDevice, setSelectedDevice] = useState<DeviceMockup | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mockupPreviewUrl, setMockupPreviewUrl] = useState<string>("");

  const isVideo = uploadedFile?.type.startsWith("video/");

  const handleDeviceSelect = useCallback((device: DeviceMockup) => {
    setSelectedDevice(device);
  }, []);

  const handleDeviceClick = useCallback((device: DeviceMockup) => {
    setSelectedDevice(device);
    setCurrentStep("upload");
  }, []);

  const handleFileSelect = useCallback((file: File, preview: string) => {
    setUploadedFile(file);
    setFilePreview(preview);
    setCurrentStep("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Transition to crop after a brief delay
          setTimeout(() => {
            setCurrentStep("crop");
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  }, []);

  const handleCropComplete = useCallback((crop: CropArea) => {
    setCropArea(crop);
    setCurrentStep("preview");
  }, []);

  const handleGenerateMockup = useCallback(() => {
    setCurrentStep("process");
    setProcessingStatus("processing");
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingStatus("success");
          // Generate mockup preview (in real app, this would be the actual processed mockup)
          setMockupPreviewUrl(filePreview);
          setCurrentStep("download");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  }, [filePreview]);

  const handleDownload = useCallback(
    (format: "gif" | "mov") => {
      // In a real app, this would trigger the actual download
      console.log(`Downloading as ${format}`);

      // Create a mock download
      const link = document.createElement("a");
      link.href = filePreview;
      link.download = `mockup-${selectedDevice?.id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [filePreview, selectedDevice]
  );

  const handleReset = useCallback(() => {
    setCurrentStep("device");
    setSelectedDevice(null);
    setUploadedFile(null);
    setFilePreview("");
    setCropArea(null);
    setProcessingStatus("idle");
    setProgress(0);
    setMockupPreviewUrl("");
  }, []);

  // Listen for reset event from logo click
  useEffect(() => {
    const handleReset = () => {
      console.log("Reset event received - resetting state");
      setCurrentStep("device");
      setSelectedDevice(null);
      setUploadedFile(null);
      setFilePreview("");
      setCropArea(null);
      setProcessingStatus("idle");
      setProgress(0);
      setMockupPreviewUrl("");
    };

    window.addEventListener("mockup-reset", handleReset);
    return () => window.removeEventListener("mockup-reset", handleReset);
  }, []);

  const steps = [
    { id: "device", label: "Select Device", completed: !!selectedDevice },
    { id: "upload", label: "Upload File", completed: !!uploadedFile },
    { id: "crop", label: "Crop & Adjust", completed: !!cropArea },
    {
      id: "preview",
      label: "Preview",
      completed:
        currentStep === "preview" ||
        currentStep === "process" ||
        currentStep === "download",
    },
    {
      id: "download",
      label: "Download",
      completed: currentStep === "download",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">Create Device Mockups</h1>
        <p className="text-lg text-muted-foreground">
          Transform your designs into stunning device mockups in seconds
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Connecting lines layer */}
              <div className="absolute top-5 left-0 right-0 flex justify-between px-5">
                {steps.slice(0, -1).map((step, index) => (
                  <div
                    key={`line-${step.id}`}
                    className="flex-1 flex justify-center"
                  >
                    <div
                      className={`h-0.5 w-full ${
                        step.completed ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Steps layer */}
              <div className="relative flex items-start justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm z-10
                      ${
                        step.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                    >
                      {step.completed ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center whitespace-nowrap ${
                        step.completed
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Step 1: Device Selection */}
        {currentStep === "device" && (
          <DeviceSelector
            selectedDevice={selectedDevice}
            onSelectDevice={handleDeviceSelect}
            onDeviceClick={handleDeviceClick}
          />
        )}

        {/* Step 2: File Upload */}
        {currentStep === "upload" && (
          <>
            <FileUploader onFileSelect={handleFileSelect} />

            <Button
              variant="outline"
              onClick={() => setCurrentStep("device")}
              className="w-full"
            >
              Back to Device Selection
            </Button>
          </>
        )}

        {/* Step 2.5: Uploading with Progress */}
        {currentStep === "uploading" && uploadedFile && (
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Uploading File</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we prepare your file...
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {!isVideo && filePreview && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={filePreview}
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
                    <p className="font-medium truncate">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      {isVideo ? "Video" : "Image"} •{" "}
                      {uploadedFile.type.split("/")[1].toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Upload Progress
                    </span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Crop */}
        {currentStep === "crop" && uploadedFile && (
          <>
            <ImageCropper
              file={uploadedFile}
              preview={filePreview}
              aspectRatio={selectedDevice?.aspectRatio}
              onCropComplete={handleCropComplete}
            />

            <Button
              variant="outline"
              onClick={() => setCurrentStep("upload")}
              className="w-full"
            >
              Back to Upload
            </Button>
          </>
        )}

        {/* Step 4: Preview & Generate */}
        {currentStep === "preview" && selectedDevice && (
          <>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your mockup is ready to be processed. Click the button below
                    to generate your device mockup.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Device</span>
                    <span className="font-medium">{selectedDevice.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">File</span>
                    <span className="font-medium">{uploadedFile?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="secondary">
                      {isVideo ? "Video" : "Image"}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateMockup}
                  className="w-full gap-2"
                  size="lg"
                >
                  Generate Mockup
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              onClick={() => setCurrentStep("crop")}
              className="w-full"
            >
              Back to Crop
            </Button>
          </>
        )}

        {/* Step 5: Processing */}
        {currentStep === "process" && (
          <ProcessingIndicator
            status={processingStatus}
            progress={progress}
            message="Generating your device mockup..."
          />
        )}

        {/* Step 6: Download */}
        {currentStep === "download" && (
          <>
            <DownloadButton
              onDownload={handleDownload}
              fileName={`${selectedDevice?.id}-mockup`}
              previewUrl={mockupPreviewUrl}
            />

            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full gap-2"
              style={{ marginTop: "16px", marginBottom: "16px" }}
            >
              <RefreshCwIcon className="w-4 h-4" />
              Create Another Mockup
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
