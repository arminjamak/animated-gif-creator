import { useState } from "react";
import { DeviceSelection } from "./components/DeviceSelection";
import { FileUpload } from "./components/FileUpload";
import { ProcessAndDownload } from "./components/ProcessAndDownload";
import { UpgradeModal } from "./components/UpgradeModal";
import imgGeminiGeneratedImageB41Cfzb41Cfzb41C1 from "./assets/e4e504c58fbcb6230c59beef695b16fbe8fe88b3.png";
import imgGeminiGeneratedImageTz1Exytz1Exytz1E1 from "./assets/67f24e8419bff5e3effca5aeac1f68520faf2d60.png";
import imgGeminiGeneratedImageAvok6Iavok6Iavok1 from "./assets/6a20dad0a2060f128b266554ad538181742a2399.png";
import imgGeminiGeneratedImage7Leqyg7Leqyg7Leq1 from "./assets/e374b7b9b02565a79afc8e0e9ac1f5a4c481a49b.png";
import imgGeminiGeneratedImageDo0Ie1Do0Ie1Do0I1 from "./assets/da5a87cad34dcd0319518b0bbcc51faf3db35ef2.png";
import svgPaths from "./imports/svg-4g7hb7p1mh";

export type DeviceMockup = {
  id: string;
  image: string;
  name: string;
  screenArea: {
    points?: Array<{ x: number; y: number }>; // 4 corner points [TL, TR, BR, BL]
    x: number; // Fallback bounding box
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
};

export const DEVICE_MOCKUPS: DeviceMockup[] = [
  {
    id: "device-1",
    image: imgGeminiGeneratedImageB41Cfzb41Cfzb41C1,
    name: "Workspace Setup",
    screenArea: {points: [{x: 0.0845, y: 0.3452}, {x: 0.4907, y: 0.3384}, {x: 0.5581, y: 0.6519}, {x: 0.1587, y: 0.7173}], x: 0.08, y: 0.34, width: 0.47, height: 0.38, rotation: 0}
  },
  {
    id: "device-2",
    image: imgGeminiGeneratedImageTz1Exytz1Exytz1E1,
    name: "Coffee Desk",
    screenArea: {points: [{x: 0.2104, y: 0.4932}, {x: 0.5347, y: 0.4736}, {x: 0.5825, y: 0.7354}, {x: 0.2534, y: 0.7901}], x: 0.21, y: 0.47, width: 0.37, height: 0.32, rotation: 0}
  },
  {
    id: "device-3",
    image: imgGeminiGeneratedImageAvok6Iavok6Iavok1,
    name: "City Night",
    screenArea: {points: [{x: 0.1929, y: 0.461}, {x: 0.5435, y: 0.4375}, {x: 0.5786, y: 0.6856}, {x: 0.2271, y: 0.7471}], x: 0.19, y: 0.44, width: 0.39, height: 0.31, rotation: 0}
  },
  {
    id: "device-4",
    image: imgGeminiGeneratedImage7Leqyg7Leqyg7Leq1,
    name: "Cozy Fireplace",
    screenArea: {points: [{x: 0.5903, y: 0.3926}, {x: 0.8726, y: 0.3828}, {x: 0.7983, y: 0.7158}, {x: 0.522, y: 0.6475}], x: 0.52, y: 0.38, width: 0.35, height: 0.33, rotation: 0}
  },
  {
    id: "device-5",
    image: imgGeminiGeneratedImageDo0Ie1Do0Ie1Do0I1,
    name: "Modern Office",
    screenArea: {points: [{x: 0.5894, y: 0.3906}, {x: 0.8755, y: 0.3809}, {x: 0.7974, y: 0.7158}, {x: 0.521, y: 0.6504}], x: 0.52, y: 0.38, width: 0.35, height: 0.33, rotation: 0}
  }
];

type Step = "select-device" | "upload-file" | "process";

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>("select-device");
  const [selectedDevice, setSelectedDevice] = useState<DeviceMockup | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    url: string;
    type: "image" | "video" | "gif";
    croppedArea: { x: number; y: number; width: number; height: number } | null;
  } | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleDeviceSelect = (device: DeviceMockup) => {
    setSelectedDevice(device);
    setCurrentStep("upload-file");
  };

  const handleFileUpload = (
    file: File,
    url: string,
    type: "image" | "video" | "gif",
    croppedArea: { x: number; y: number; width: number; height: number } | null
  ) => {
    setUploadedFile({ file, url, type, croppedArea });
    setCurrentStep("process");
  };

  const handleBack = () => {
    if (currentStep === "upload-file") {
      setCurrentStep("select-device");
      setSelectedDevice(null);
    } else if (currentStep === "process") {
      setCurrentStep("upload-file");
      setUploadedFile(null);
    }
  };

  const handleStartOver = () => {
    setCurrentStep("select-device");
    setSelectedDevice(null);
    setUploadedFile(null);
  };

  const handleUpgradeClick = () => {
    setIsUpgradeModalOpen(true);
  };

  const handleUpgradeModalClose = () => {
    setIsUpgradeModalOpen(false);
  };

  return (
    <div className="bg-black relative min-h-screen w-full overflow-hidden">
      {/* Top Bar - Full Width */}
      <div className="absolute backdrop-blur-[40px] bg-[rgba(255,255,255,0.05)] h-[80px] left-0 top-0 w-full z-20">
        {/* DeviceShots Logo */}
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[20px] text-nowrap text-white whitespace-pre left-[42px] top-[28px]">
          DeviceShots
        </p>

        {/* Progress Menu - Center */}
        <div className="absolute left-1/2 top-[28px] -translate-x-1/2 flex gap-[8px] items-center">
          <p
            className={`font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[20px] text-nowrap text-white whitespace-pre ${
              currentStep !== "select-device" ? "opacity-40" : ""
            }`}
          >
            Choose a mockup
          </p>
          <ChevronRight />
          <p
            className={`font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[20px] text-nowrap text-white whitespace-pre ${
              currentStep !== "upload-file" ? "opacity-40" : ""
            }`}
          >
            Upload a file
          </p>
          <ChevronRight />
          <p
            className={`font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[20px] text-nowrap text-white whitespace-pre ${
              currentStep !== "process" ? "opacity-40" : ""
            }`}
          >
            Process
          </p>
        </div>

        {/* Generation Counter */}
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[16px] text-nowrap text-white whitespace-pre opacity-40 right-[178px] top-[31px]">
          3 free generations left
        </p>

        {/* Upgrade Button */}
        <button className="absolute bg-white h-[45px] right-[42px] rounded-[8px] top-[16px] w-[108px] flex items-center justify-center hover:bg-white/90 transition-colors" onClick={handleUpgradeClick}>
          <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[19px] text-nowrap text-black whitespace-pre">
            Upgrade
          </p>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative w-full min-h-screen pb-[64px]">
        {currentStep === "select-device" && (
          <DeviceSelection devices={DEVICE_MOCKUPS} onSelect={handleDeviceSelect} />
        )}

        {currentStep === "upload-file" && selectedDevice && (
          <FileUpload device={selectedDevice} onUpload={handleFileUpload} onBack={handleBack} />
        )}

        {currentStep === "process" && selectedDevice && uploadedFile && (
          <ProcessAndDownload
            device={selectedDevice}
            uploadedFile={uploadedFile}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={handleUpgradeModalClose} />
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g opacity="0.4">
          <path
            d="M9 18L15 12L9 6"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}