import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

type CropToolProps = {
  fileUrl: string;
  fileType: "image" | "video" | "gif";
  onComplete: (croppedArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  onSkip: () => void;
  onBack: () => void;
};

export function CropTool({
  fileUrl,
  fileType,
  onComplete,
  onSkip,
  onBack,
}: CropToolProps) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({
    x: 50,
    y: 50,
    width: 300,
    height: 300,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, cropX: 0, cropY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (fileType === "image" || fileType === "gif") {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        // Set crop area to cover the full image
        const containerWidth = containerRef.current?.clientWidth || 800;
        const containerHeight = containerRef.current?.clientHeight || 600;
        
        // Calculate the actual image display size (object-contain)
        const imageAspect = img.width / img.height;
        const containerAspect = containerWidth / containerHeight;
        
        let displayWidth, displayHeight;
        if (imageAspect > containerAspect) {
          // Image is wider than container
          displayWidth = containerWidth;
          displayHeight = containerWidth / imageAspect;
        } else {
          // Image is taller than container
          displayHeight = containerHeight;
          displayWidth = containerHeight * imageAspect;
        }
        
        // Center the crop area and match image bounds
        const x = (containerWidth - displayWidth) / 2;
        const y = (containerHeight - displayHeight) / 2;
        
        setCropArea({
          x: x,
          y: y,
          width: displayWidth,
          height: displayHeight,
        });
      };
      img.src = fileUrl;
    } else if (fileType === "video") {
      // For videos, we need to wait for metadata to load
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        setImageDimensions({ width: video.videoWidth, height: video.videoHeight });
        // Set crop area to cover the full video
        const containerWidth = containerRef.current?.clientWidth || 800;
        const containerHeight = containerRef.current?.clientHeight || 600;
        
        // Calculate the actual video display size (object-contain)
        const videoAspect = video.videoWidth / video.videoHeight;
        const containerAspect = containerWidth / containerHeight;
        
        let displayWidth, displayHeight;
        if (videoAspect > containerAspect) {
          // Video is wider than container
          displayWidth = containerWidth;
          displayHeight = containerWidth / videoAspect;
        } else {
          // Video is taller than container
          displayHeight = containerHeight;
          displayWidth = containerHeight * videoAspect;
        }
        
        // Center the crop area and match video bounds
        const x = (containerWidth - displayWidth) / 2;
        const y = (containerHeight - displayHeight) / 2;
        
        setCropArea({
          x: x,
          y: y,
          width: displayWidth,
          height: displayHeight,
        });
      };
      video.src = fileUrl;
    }
  }, [fileUrl, fileType]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - cropArea.x,
      y: e.clientY - rect.top - cropArea.y,
    });
  };

  const handleCornerMouseDown = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    setIsResizing(corner);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: cropArea.width,
      height: cropArea.height,
      cropX: cropArea.x,
      cropY: cropArea.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Handle resizing
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newX = resizeStart.cropX;
      let newY = resizeStart.cropY;
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      if (isResizing === 'nw') {
        newX = Math.max(0, Math.min(resizeStart.cropX + deltaX, resizeStart.cropX + resizeStart.width - 50));
        newY = Math.max(0, Math.min(resizeStart.cropY + deltaY, resizeStart.cropY + resizeStart.height - 50));
        newWidth = resizeStart.width - (newX - resizeStart.cropX);
        newHeight = resizeStart.height - (newY - resizeStart.cropY);
      } else if (isResizing === 'ne') {
        newY = Math.max(0, Math.min(resizeStart.cropY + deltaY, resizeStart.cropY + resizeStart.height - 50));
        newWidth = Math.max(50, Math.min(resizeStart.width + deltaX, rect.width - resizeStart.cropX));
        newHeight = resizeStart.height - (newY - resizeStart.cropY);
      } else if (isResizing === 'sw') {
        newX = Math.max(0, Math.min(resizeStart.cropX + deltaX, resizeStart.cropX + resizeStart.width - 50));
        newWidth = resizeStart.width - (newX - resizeStart.cropX);
        newHeight = Math.max(50, Math.min(resizeStart.height + deltaY, rect.height - resizeStart.cropY));
      } else if (isResizing === 'se') {
        newWidth = Math.max(50, Math.min(resizeStart.width + deltaX, rect.width - resizeStart.cropX));
        newHeight = Math.max(50, Math.min(resizeStart.height + deltaY, rect.height - resizeStart.cropY));
      }

      setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
      return;
    }

    // Handle dragging
    if (isDragging) {
      const newX = Math.max(
        0,
        Math.min(e.clientX - rect.left - dragStart.x, rect.width - cropArea.width)
      );
      const newY = Math.max(
        0,
        Math.min(e.clientY - rect.top - dragStart.y, rect.height - cropArea.height)
      );

      setCropArea({ ...cropArea, x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleComplete = () => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Get the media element (image or video)
    const mediaElement = fileType === "video" ? videoRef.current : imageRef.current;
    if (!mediaElement) return;

    const mediaRect = mediaElement.getBoundingClientRect();

    // Calculate relative position and size
    const relativeX = (cropArea.x - (mediaRect.left - containerRect.left)) / mediaRect.width;
    const relativeY = (cropArea.y - (mediaRect.top - containerRect.top)) / mediaRect.height;
    const relativeWidth = cropArea.width / mediaRect.width;
    const relativeHeight = cropArea.height / mediaRect.height;

    onComplete({
      x: relativeX,
      y: relativeY,
      width: relativeWidth,
      height: relativeHeight,
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-[80px]">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[16px] rounded-2xl p-8">
          <h2 className="text-white text-3xl mb-6 text-center font-[Inter] text-[24px]">Crop Your Content</h2>
          <p className="text-white/60 text-center mb-8 font-[Inter] -mt-3">
            Drag the crop area to move it, or drag the corners to resize
          </p>

          <div
            ref={containerRef}
            className="relative bg-black rounded-lg mb-6"
            style={{ height: "600px" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {fileType === "video" ? (
              <video
                ref={videoRef}
                src={fileUrl}
                className="absolute inset-0 w-full h-full object-contain"
                muted
                loop
                autoPlay
              />
            ) : (
              <img
                ref={imageRef}
                src={fileUrl}
                alt="Crop preview"
                className="absolute inset-0 w-full h-full object-contain select-none"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <mask id="crop-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={cropArea.x}
                      y={cropArea.y}
                      width={cropArea.width}
                      height={cropArea.height}
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="black"
                  opacity="0.5"
                  mask="url(#crop-mask)"
                />
              </svg>
            </div>

            {/* Crop Area */}
            <div
              className="absolute border-4 border-white cursor-move pointer-events-auto"
              style={{
                left: `${cropArea.x}px`,
                top: `${cropArea.y}px`,
                width: `${cropArea.width}px`,
                height: `${cropArea.height}px`,
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Corner handles */}
              <div 
                className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full cursor-nw-resize" 
                onMouseDown={(e) => handleCornerMouseDown(e, 'nw')}
              />
              <div 
                className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full cursor-ne-resize" 
                onMouseDown={(e) => handleCornerMouseDown(e, 'ne')}
              />
              <div 
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full cursor-sw-resize" 
                onMouseDown={(e) => handleCornerMouseDown(e, 'sw')}
              />
              <div 
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full cursor-se-resize" 
                onMouseDown={(e) => handleCornerMouseDown(e, 'se')}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-white/30 text-[rgb(0,0,0)] hover:bg-white/90 hover:text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              className="bg-white text-black hover:bg-white/90"
            >
              <Check className="mr-2 size-4" />
              Apply Crop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}