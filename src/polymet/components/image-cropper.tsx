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
  // Default to full image (entire crop area)
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
    // Default to full image crop (don't constrain by aspect ratio initially)
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
  }, []);

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
                Math.min(x, prev.x + prev.width - 1)
              );
              const newTopY = Math.max(
                0,
                Math.min(y, prev.y + prev.height - 1)
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
                Math.min(y, prev.y + prev.height - 1)
              );
              newCrop.width = Math.max(1, Math.min(x - prev.x, 100 - prev.x));
              newCrop.height = prev.height + (prev.y - newTopY2);
              newCrop.y = newTopY2;
              break;

            case "bottom-left":
              // Horizontal movement affects left edge, vertical affects bottom edge
              const newLeftX2 = Math.max(
                0,
                Math.min(x, prev.x + prev.width - 1)
              );
              newCrop.width = prev.width + (prev.x - newLeftX2);
              newCrop.height = Math.max(1, Math.min(y - prev.y, 100 - prev.y));
              newCrop.x = newLeftX2;
              break;

            case "bottom-right":
              // Horizontal movement affects right edge, vertical affects bottom edge
              newCrop.width = Math.max(1, Math.min(x - prev.x, 100 - prev.x));
              newCrop.height = Math.max(1, Math.min(y - prev.y, 100 - prev.y));
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
    // Reset to full image crop
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
  }, []);

  const handleApplyCrop = useCallback(() => {
    // Normalize crop values from percentage (0-100) to decimal (0-1)
    const normalizedCrop = {
      x: crop.x / 100,
      y: crop.y / 100,
      width: crop.width / 100,
      height: crop.height / 100,
    };
    onCropComplete(normalizedCrop);
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
          {/* Controls */}
          <div className="mb-4">
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

          <div
            ref={containerRef}
            className="relative w-full aspect-video bg-muted rounded-lg overflow-visible cursor-move"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Image/Video Preview */}
            <div className="absolute inset-0 flex items-center justify-center select-none">
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={preview}
                  className="max-w-full max-h-full pointer-events-none"
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
                  className="max-w-full max-h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              )}
            </div>

            {/* Crop Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dark overlays on each side of the crop area */}
              {/* Top overlay */}
              <div 
                className="absolute left-0 right-0 top-0 bg-black/40"
                style={{ height: `${crop.y}%` }}
              />
              {/* Bottom overlay */}
              <div 
                className="absolute left-0 right-0 bottom-0 bg-black/40"
                style={{ height: `${100 - crop.y - crop.height}%` }}
              />
              {/* Left overlay */}
              <div 
                className="absolute left-0 bg-black/40"
                style={{ 
                  top: `${crop.y}%`,
                  width: `${crop.x}%`,
                  height: `${crop.height}%`
                }}
              />
              {/* Right overlay */}
              <div 
                className="absolute right-0 bg-black/40"
                style={{ 
                  top: `${crop.y}%`,
                  width: `${100 - crop.x - crop.width}%`,
                  height: `${crop.height}%`
                }}
              />
              
              {/* Crop area - clear window with border */}
              <div
                className="absolute border-2 border-primary bg-transparent pointer-events-auto cursor-move"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }}
                onMouseDown={handleMouseDown}
              >
                {/* Corner handles - with z-index to ensure they're above everything */}
                <div
                  className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize z-50"
                  style={{ transform: 'translate(0, 0)' }}
                  onMouseDown={(e) => handleHandleMouseDown(e, "top-left")}
                />

                <div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize z-50"
                  style={{ transform: 'translate(0, 0)' }}
                  onMouseDown={(e) => handleHandleMouseDown(e, "top-right")}
                />

                <div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize z-50"
                  style={{ transform: 'translate(0, 0)' }}
                  onMouseDown={(e) => handleHandleMouseDown(e, "bottom-left")}
                />

                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize z-50"
                  style={{ transform: 'translate(0, 0)' }}
                  onMouseDown={(e) => handleHandleMouseDown(e, "bottom-right")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
