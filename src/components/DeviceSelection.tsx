import { DeviceMockup } from "../App";

type DeviceSelectionProps = {
  devices: DeviceMockup[];
  onSelect: (device: DeviceMockup) => void;
};

export function DeviceSelection({ devices, onSelect }: DeviceSelectionProps) {
  return (
    <div className="w-full h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40">
      <div className="text-center mb-12 pt-[120px] px-[64px]">
        <h1 className="text-white text-5xl mb-4 text-[24px] font-[Inter]">Choose Your Device Mockup</h1>
        <p className="text-white/60 text-xl text-[16px] font-[Inter]">
          Select a device shot to place your content on
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pb-[32px] px-[64px] pt-[0px] pr-[42px] pl-[42px]">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => onSelect(device)}
            className="group relative rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            <div className="aspect-[4/3] bg-gray-800 overflow-hidden">
              <img
                src={device.image}
                alt={device.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
              <p className="text-white text-xl">{device.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}