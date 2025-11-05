import { useState } from "react";
import {
  deviceMockups,
  deviceCategories,
  type DeviceMockup,
} from "@/polymet/data/device-mockups-integrated";
import { Button } from "@/components/ui/button";
import {
  SmartphoneIcon,
  TabletIcon,
  LaptopIcon,
  MonitorIcon,
  WatchIcon,
  Grid3x3Icon,
} from "lucide-react";

interface DeviceSelectorProps {
  selectedDevice: DeviceMockup | null;
  onSelectDevice: (device: DeviceMockup) => void;
  onDeviceClick?: (device: DeviceMockup) => void;
}

const iconMap = {
  Smartphone: SmartphoneIcon,
  Tablet: TabletIcon,
  Laptop: LaptopIcon,
  Monitor: MonitorIcon,
  Watch: WatchIcon,
  Grid3x3: Grid3x3Icon,
};

export function DeviceSelector({
  selectedDevice,
  onSelectDevice,
  onDeviceClick,
}: DeviceSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredDevices =
    selectedCategory === "all"
      ? deviceMockups
      : deviceMockups.filter((device) => device.category === selectedCategory);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-lg font-semibold mb-3">Select Device</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {deviceCategories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            return (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />

                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-2 flex-1">
        {filteredDevices.map((device) => {
          return (
            <div
              key={device.id}
              className="relative cursor-pointer group"
              onClick={() => {
                onSelectDevice(device);
                if (onDeviceClick) {
                  onDeviceClick(device);
                }
              }}
            >
              {/* Device Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No devices found in this category
        </div>
      )}
    </div>
  );
}
