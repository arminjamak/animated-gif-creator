import { CheckIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PricingPackage {
  generations: number;
  price: number;
  popular?: boolean;
}

const packages: PricingPackage[] = [
  { generations: 10, price: 5 },
  { generations: 20, price: 8, popular: true },
  { generations: 30, price: 11 },
];

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const handlePurchase = (pkg: PricingPackage) => {
    console.log(`Purchasing ${pkg.generations} generations for $${pkg.price}`);
    // Handle purchase logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a package to get more generations and create unlimited
            mockups
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {packages.map((pkg) => (
            <div
              key={pkg.generations}
              className={`relative p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow ${
                pkg.popular ? "border-primary" : "border-border"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Popular
                </div>
              )}

              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold">${pkg.price}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    one-time payment
                  </div>
                </div>

                <div className="py-4 border-y border-border">
                  <div className="text-2xl font-semibold">
                    {pkg.generations}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Generations
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary" />

                    <span>All device types</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary" />

                    <span>High quality exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary" />

                    <span>No watermarks</span>
                  </li>
                </ul>

                <Button
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(pkg)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
