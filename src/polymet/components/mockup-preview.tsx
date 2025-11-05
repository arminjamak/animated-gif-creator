import { type DeviceMockup } from "@/polymet/data/device-mockups-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SmartphoneIcon,
  TabletIcon,
  LaptopIcon,
  MonitorIcon,
  WatchIcon,
} from "lucide-react";

interface MockupPreviewProps {
  device: DeviceMockup;
  preview: string;
  isVideo?: boolean;
}

const iconMap = {
  Smartphone: SmartphoneIcon,
  Tablet: TabletIcon,
  Laptop: LaptopIcon,
  Monitor: MonitorIcon,
  Watch: WatchIcon,
};

export function MockupPreview({
  device,
  preview,
  isVideo = false,
}: MockupPreviewProps) {
  const Icon = iconMap[device.icon as keyof typeof iconMap];

  // Calculate display dimensions while maintaining aspect ratio
  const maxWidth = 400;
  const maxHeight = 500;

  let displayWidth = device.width;
  let displayHeight = device.height;

  // Scale down if needed
  if (displayWidth > maxWidth || displayHeight > maxHeight) {
    const widthRatio = maxWidth / displayWidth;
    const heightRatio = maxHeight / displayHeight;
    const scale = Math.min(widthRatio, heightRatio);

    displayWidth = displayWidth * scale;
    displayHeight = displayHeight * scale;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-sm text-muted-foreground">{device.name} mockup</p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Icon className="w-3 h-3" />

          {device.category}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            {/* Device Frame */}
            <div
              className="relative rounded-2xl shadow-2xl overflow-hidden"
              style={{
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
                backgroundColor: device.frameColor,
                padding:
                  device.category === "phone"
                    ? "12px"
                    : device.category === "tablet"
                      ? "16px"
                      : device.category === "laptop"
                        ? "8px 8px 32px 8px"
                        : device.category === "watch"
                          ? "8px"
                          : "20px",
              }}
            >
              {/* Screen */}
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                {isVideo ? (
                  <video
                    src={preview}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Content preview"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Screen Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </div>

              {/* Device-specific details */}
              {device.category === "phone" && (
                <>
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />

                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
                </>
              )}

              {device.category === "laptop" && (
                <>
                  {/* Keyboard area */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-8 rounded-b-2xl"
                    style={{ backgroundColor: device.frameColor }}
                  />
                </>
              )}

              {device.category === "watch" && (
                <>
                  {/* Digital Crown */}
                  <div
                    className="absolute right-0 top-1/4 w-2 h-8 rounded-l"
                    style={{ backgroundColor: device.frameColor }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Device Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Resolution</span>
              <span className="font-medium">
                {device.width} × {device.height}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Aspect Ratio</span>
              <span className="font-medium">
                {device.aspectRatio.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
