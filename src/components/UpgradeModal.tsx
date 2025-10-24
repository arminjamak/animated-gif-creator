import { X } from "lucide-react";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-30"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 backdrop-blur-[50px] bg-[rgba(47,47,47,0.6)] rounded-[12px] w-[471px] p-8">
        {/* Top */}
        <div className="flex items-center justify-between mb-10">
          <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[32px] not-italic text-[24px] text-center text-nowrap text-white whitespace-pre font-[Inter]">
            Upgrade
          </p>
          <button 
            onClick={onClose}
            className="size-8 flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <X className="size-8 text-white" strokeWidth={2} />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <button className="bg-[rgba(255,255,255,0.1)] rounded-[16px] px-6 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.15)] transition-colors">
            <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[32px] text-[20px] text-white font-[Inter]">
              10 generations
            </p>
            <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[32px] text-[20px] text-white font-[Inter]">
              5$
            </p>
          </button>

          <button className="bg-[rgba(255,255,255,0.1)] rounded-[16px] px-6 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.15)] transition-colors">
            <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[32px] text-[20px] text-white font-[Inter]">
              20 generations
            </p>
            <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[32px] text-[20px] text-white font-[Inter]">
              8$
            </p>
          </button>

          <button className="bg-[rgba(255,255,255,0.1)] rounded-[16px] px-6 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.15)] transition-colors text-[15px]">
            <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[32px] text-[20px] text-white font-[Inter]">
              30 generations
            </p>
            <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[32px] text-[20px] text-white font-[Inter]">
              11$
            </p>
          </button>
        </div>
      </div>
    </>
  );
}