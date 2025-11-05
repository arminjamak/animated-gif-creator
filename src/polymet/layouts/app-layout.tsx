import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SmartphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/polymet/components/theme-toggle";
import { UpgradeModal } from "@/polymet/components/upgrade-modal";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={(e) => {
              console.log("Logo clicked - triggering reset");
              // Dispatch custom event for reset
              window.dispatchEvent(new CustomEvent("mockup-reset"));
            }}
          >
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <SmartphoneIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Mockups.pics</h1>
              <p className="text-xs text-muted-foreground">
                Device Mockup Generator
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-muted-foreground">
              3 free generations left
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Button onClick={() => setUpgradeModalOpen(true)}>Upgrade</Button>
            </div>
          </div>

          <UpgradeModal
            open={upgradeModalOpen}
            onOpenChange={setUpgradeModalOpen}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col min-h-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Mockups.pics. Create stunning device mockups.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                to="/about"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/help"
                className="hover:text-foreground transition-colors"
              >
                Help
              </Link>
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
