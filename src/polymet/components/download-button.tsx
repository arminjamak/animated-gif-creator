import { Button } from "@/components/ui/button";
import { DownloadIcon, FileIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DownloadButtonProps {
  onDownload: (format: "gif" | "mov") => void;
  disabled?: boolean;
  fileName?: string;
  previewUrl?: string;
}

export function DownloadButton({
  onDownload,
  disabled = false,
  fileName = "mockup",
  previewUrl,
}: DownloadButtonProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Download Mockup</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred format
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onDownload("gif")}
                disabled={disabled}
                className="gap-2 h-auto py-4 flex-col"
                variant="outline"
              >
                <DownloadIcon className="w-5 h-5" />

                <div className="text-center">
                  <div className="font-semibold">GIF</div>
                  <div className="text-xs text-muted-foreground">Animated</div>
                </div>
              </Button>

              <Button
                onClick={() => onDownload("mov")}
                disabled={disabled}
                className="gap-2 h-auto py-4 flex-col"
                variant="outline"
              >
                <DownloadIcon className="w-5 h-5" />

                <div className="text-center">
                  <div className="font-semibold">MOV</div>
                  <div className="text-xs text-muted-foreground">Video</div>
                </div>
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                File name: {fileName}.gif / {fileName}.mov
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Image */}
      {previewUrl && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-center">Preview</h3>
              <div className="rounded-lg overflow-hidden bg-muted border border-border">
                <img
                  src={previewUrl}
                  alt="Mockup Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
