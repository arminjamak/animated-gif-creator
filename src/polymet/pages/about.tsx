import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLinkIcon } from "lucide-react";

export function About() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">About Mockups.pics</h1>
        <p className="text-lg text-muted-foreground">
          The story behind the tool
        </p>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <img
                  src="https://assets.polymet.ai/immediate-amethyst-540311"
                  alt="Armin Jamak"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Hi, I'm Armin</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    I'm a product designer with a passion for creating beautiful
                    user interfaces. Throughout my career, I've designed
                    countless UI screens and wanted to showcase them in a more
                    engaging way.
                  </p>
                  <p>
                    I searched for tools that could help me create animated
                    device mockups of my designs, but I couldn't find anything
                    that met my needs. The existing solutions were either too
                    complicated, too expensive, or simply didn't produce the
                    quality I was looking for.
                  </p>
                  <p>
                    That's why I created Mockups.pics. A simple, fast, and
                    beautiful way to transform your designs into stunning device
                    mockups. Whether you're showcasing your work in a portfolio,
                    presenting to clients, or sharing on social media,
                    Mockups.pics makes it effortless.
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="gap-2"
                onClick={() =>
                  window.open("https://www.arminjamak.com", "_blank")
                }
              >
                Visit My Portfolio
                <ExternalLinkIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
