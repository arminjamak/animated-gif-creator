import { X, Loader2 } from "lucide-react";
import { useState } from "react";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PAYMENT_API = import.meta.env.VITE_PAYMENT_API_URL || '';

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<number | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async (credits: number) => {
    // Check if payment API is configured
    if (!PAYMENT_API) {
      alert('Payment system is not configured yet. Please contact support or check back later.');
      return;
    }

    setLoading(credits);
    
    try {
      const response = await fetch(`${PAYMENT_API}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

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
            disabled={loading !== null}
          >
            <X className="size-8 text-white" strokeWidth={2} />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handlePurchase(10)}
            disabled={loading !== null}
            className="bg-[rgba(255,255,255,0.1)] rounded-[16px] px-6 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.15)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[32px] text-[20px] text-white font-[Inter]">
              10 generations
            </p>
            {loading === 10 ? (
              <Loader2 className="size-6 text-white animate-spin" />
            ) : (
              <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[32px] text-[20px] text-white font-[Inter]">
                $5
              </p>
            )}
          </button>

          <button 
            onClick={() => handlePurchase(20)}
            disabled={loading !== null}
            className="bg-[rgba(255,255,255,0.1)] rounded-[16px] px-6 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.15)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[32px] text-[20px] text-white font-[Inter]">
              20 generations
            </p>
            {loading === 20 ? (
              <Loader2 className="size-6 text-white animate-spin" />
            ) : (
              <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[32px] text-[20px] text-white font-[Inter]">
                $8
              </p>
            )}
          </button>

          <button 
            onClick={() => handlePurchase(30)}
            disabled={loading !== null}
            className="bg-[rgba(255,255,255,0.1)] rounded-[16px] px-6 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.15)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[32px] text-[20px] text-white font-[Inter]">
              30 generations
            </p>
            {loading === 30 ? (
              <Loader2 className="size-6 text-white animate-spin" />
            ) : (
              <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[32px] text-[20px] text-white font-[Inter]">
                $11
              </p>
            )}
          </button>
        </div>
      </div>
    </>
  );
}