import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CropIcon, MaximizeIcon } from "lucide-react";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  file: File;
  preview: string;
  aspectRatio?: number;
  onCropComplete: (cropArea: CropArea) => void;
}

export function ImageCropper({
  file,
  preview,
  aspectRatio = 16 / 9,
  onCropComplete,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = file.type.startsWith("video/");

  useEffect(() => {
    // Initialize crop area based on aspect ratio
    if (aspectRatio) {
      const containerWidth = 100;
      const containerHeight = 100;

      let cropWidth = containerWidth;
      let cropHeight = cropWidth / aspectRatio;

      if (cropHeight > containerHeight) {
        cropHeight = containerHeight;
        cropWidth = cropHeight * aspectRatio;
      }

      const x = (containerWidth - cropWidth) / 2;
      const y = (containerHeight - cropHeight) / 2;

      setCrop({ x, y, width: cropWidth, height: cropHeight });
    }
  }, [aspectRatio]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setIsDragging(true);
      setDragStart({ x: x - crop.x, y: y - crop.y });
    },
    [crop]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (activeHandle) {
        // Handle corner dragging
        setCrop((prev) => {
          let newCrop = { ...prev };

          switch (activeHandle) {
            case "top-left":
              // Horizontal movement affects left edge, vertical affects top edge
              const newLeftX = Math.max(
                0,
                Math.min(x, prev.x + prev.width - 10)
              );
              const newTopY = Math.max(
                0,
                Math.min(y, prev.y + prev.height - 10)
              );
              newCrop.width = prev.width + (prev.x - newLeftX);
              newCrop.height = prev.height + (prev.y - newTopY);
              newCrop.x = newLeftX;
              newCrop.y = newTopY;
              break;

            case "top-right":
              // Horizontal movement affects right edge, vertical affects top edge
              const newTopY2 = Math.max(
                0,
                Math.min(y, prev.y + prev.height - 10)
              );
              newCrop.width = Math.max(10, Math.min(x - prev.x, 100 - prev.x));
              newCrop.height = prev.height + (prev.y - newTopY2);
              newCrop.y = newTopY2;
              break;

            case "bottom-left":
              // Horizontal movement affects left edge, vertical affects bottom edge
              const newLeftX2 = Math.max(
                0,
                Math.min(x, prev.x + prev.width - 10)
              );
              newCrop.width = prev.width + (prev.x - newLeftX2);
              newCrop.height = Math.max(10, Math.min(y - prev.y, 100 - prev.y));
              newCrop.x = newLeftX2;
              break;

            case "bottom-right":
              // Horizontal movement affects right edge, vertical affects bottom edge
              newCrop.width = Math.max(10, Math.min(x - prev.x, 100 - prev.x));
              newCrop.height = Math.max(10, Math.min(y - prev.y, 100 - prev.y));
              break;
          }

          return newCrop;
        });
      } else {
        // Handle crop area dragging
        const newX = Math.max(0, Math.min(x - dragStart.x, 100 - crop.width));
        const newY = Math.max(0, Math.min(y - dragStart.y, 100 - crop.height));
        setCrop((prev) => ({ ...prev, x: newX, y: newY }));
      }
    },
    [isDragging, activeHandle, crop.width, crop.height, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveHandle(null);
  }, []);

  const handleHandleMouseDown = useCallback(
    (e: React.MouseEvent, handle: string) => {
      e.stopPropagation();
      setActiveHandle(handle);
      setIsDragging(true);
    },
    []
  );

  const handleFitToScreen = useCallback(() => {
    if (aspectRatio) {
      const containerWidth = 100;
      const containerHeight = 100;

      let cropWidth = containerWidth;
      let cropHeight = cropWidth / aspectRatio;

      if (cropHeight > containerHeight) {
        cropHeight = containerHeight;
        cropWidth = cropHeight * aspectRatio;
      }

      const x = (containerWidth - cropWidth) / 2;
      const y = (containerHeight - cropHeight) / 2;

      setCrop({ x, y, width: cropWidth, height: cropHeight });
    } else {
      setCrop({ x: 0, y: 0, width: 100, height: 100 });
    }
  }, [aspectRatio]);

  const handleApplyCrop = useCallback(() => {
    onCropComplete(crop);
  }, [crop, onCropComplete]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Crop & Adjust</h2>
          <p className="text-sm text-muted-foreground">
            Drag to reposition • Drag corners to adjust crop area
          </p>
        </div>
        <Badge variant="secondary">{aspectRatio.toFixed(2)} ratio</Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <div
            ref={containerRef}
            className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden cursor-move"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Image/Video Preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={preview}
                  className="max-w-full max-h-full"
                  controls={false}
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <img
                  ref={imageRef}
                  src={preview}
                  alt="Crop preview"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Crop Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Crop area */}
              <div
                className="absolute border-2 border-primary bg-transparent pointer-events-auto cursor-move"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                }}
                onMouseDown={handleMouseDown}
              >
                {/* Corner handles */}
                <div
                  className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nwse-resize"
                  onMouseDown={(e) => handleHandleMouseDown(e, "top-left")}
                />

                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-nesw-resize"
                  onMouseDown={(e) => handleHandleMouseDown(e, "top-right")}
                />

                <div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nesw-resize"
                  onMouseDown={(e) => handleHandleMouseDown(e, "bottom-left")}
                />

                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-nwse-resize"
                  onMouseDown={(e) => handleHandleMouseDown(e, "bottom-right")}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFitToScreen}
                className="gap-2"
              >
                <MaximizeIcon className="w-4 h-4" />
                Reset
              </Button>
              <Button onClick={handleApplyCrop} className="gap-2 flex-1">
                <CropIcon className="w-4 h-4" />
                Apply Crop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
