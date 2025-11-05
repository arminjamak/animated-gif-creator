import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircleIcon } from "lucide-react";

export function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <HelpCircleIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Help & FAQ</h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about Mockups.pics
        </p>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                What happens with my data?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Your privacy is our top priority. The entire mockup generation
                process takes place locally in your browser. We don't upload
                your content anywhere, and your files never leave your device.
                Everything is processed client-side using your browser's
                capabilities, ensuring complete privacy and security.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                What file formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Mockups.pics supports both images and videos. You can upload
                JPG, PNG, GIF for images, and MP4, MOV for videos. The maximum
                file size is 50MB to ensure smooth processing in your browser.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                How many mockups can I create for free?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You get 3 free mockup generations to try out the service. After
                that, you can upgrade to one of our paid plans for unlimited
                generations. Check out our pricing by clicking the "Upgrade"
                button in the header.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                What devices are available?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a wide range of device mockups including the latest
                iPhones, Android phones, iPads, tablets, MacBooks, laptops,
                iMacs, desktop monitors, and Apple Watches. Our library is
                regularly updated with new devices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Can I download my mockups?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Once your mockup is generated, you can download it in
                either GIF or MOV format. GIF is great for web use and social
                media, while MOV provides higher quality for presentations and
                portfolios.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                How do I adjust my content to fit the device?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                After uploading your file, you'll be taken to the crop and
                adjust step. Here you can drag the corner handles to adjust the
                crop area and ensure your content fits perfectly within the
                device screen. The aspect ratio is automatically set to match
                the selected device.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                Is there a mobile app?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Currently, Mockups.pics is a web-based tool that works on any
                modern browser. While we don't have a dedicated mobile app yet,
                the website is fully responsive and works great on tablets and
                mobile devices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                What if I encounter an error?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                If you experience any issues, try refreshing the page and
                starting over. Make sure your file meets the size and format
                requirements. If problems persist, it might be due to browser
                compatibility - we recommend using the latest version of Chrome,
                Firefox, Safari, or Edge.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Still need help?</h3>
            <p className="text-sm text-muted-foreground">
              If you couldn't find the answer you're looking for, feel free to
              reach out to us at{" "}
              <a
                href="mailto:support@mockups.pics"
                className="text-primary hover:underline"
              >
                support@mockups.pics
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
