import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2Icon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

interface ProcessingIndicatorProps {
  status: "idle" | "processing" | "success" | "error";
  progress?: number;
  message?: string;
  error?: string;
}

export function ProcessingIndicator({
  status,
  progress = 0,
  message = "Processing your mockup...",
  error,
}: ProcessingIndicatorProps) {
  if (status === "idle") return null;

  return (
    <Card
      className={`
      ${status === "success" ? "border-green-500/50 bg-green-500/5" : ""}
      ${status === "error" ? "border-destructive/50 bg-destructive/5" : ""}
    `}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {/* Icon */}
          <div className="relative">
            {status === "processing" && (
              <div className="p-4 rounded-full bg-primary/10">
                <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="p-4 rounded-full bg-green-500/10">
                <CheckCircle2Icon className="w-8 h-8 text-green-500" />
              </div>
            )}
            {status === "error" && (
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertCircleIcon className="w-8 h-8 text-destructive" />
              </div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2 w-full max-w-md">
            <p className="font-medium">
              {status === "processing" && message}
              {status === "success" && "Mockup created successfully!"}
              {status === "error" && "Processing failed"}
            </p>

            {status === "error" && error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {status === "processing" && (
              <>
                <Progress value={progress} className="w-full" />

                <p className="text-sm text-muted-foreground">
                  {progress}% complete
                </p>
              </>
            )}

            {status === "success" && (
              <p className="text-sm text-muted-foreground">
                Your mockup is ready to download
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
