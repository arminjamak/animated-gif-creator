import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <ShieldCheckIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: December 2024
        </p>
      </div>

      {/* Privacy Content */}
      <Card>
        <CardContent className="p-8 space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Your Privacy Matters</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Mockups.pics, we take your privacy seriously. This Privacy
              Policy explains how we handle your data and protect your
              information when you use our service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">
              Local Processing - No Upload Required
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The core principle of Mockups.pics is privacy by design. All
              mockup generation happens entirely in your browser using
              client-side processing. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                Your images and videos never leave your device - they are not
                uploaded to our servers
              </li>
              <li>
                All processing is done locally using your browser's capabilities
              </li>
              <li>
                We have no access to your content, designs, or creative work
              </li>
              <li>Your files are never stored, cached, or transmitted</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Data We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect minimal data to provide and improve our service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Usage Analytics:</strong> We collect anonymous usage
                statistics such as page views, feature usage, and device types
                to improve the service
              </li>
              <li>
                <strong>Account Information:</strong> If you create an account
                for paid plans, we collect your email address and payment
                information (processed securely through our payment provider)
              </li>
              <li>
                <strong>Browser Storage:</strong> We use local storage in your
                browser to remember your preferences and generation count
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">
              Data We Don't Collect or Store
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We explicitly do not collect, store, or have access to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your uploaded images or videos</li>
              <li>Your generated mockups</li>
              <li>Any content you process through our service</li>
              <li>Screenshots or previews of your work</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies to maintain your session and remember
              your preferences. We do not use third-party tracking cookies or
              sell your data to advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Payment Processing:</strong> Stripe for secure payment
                processing (they have their own privacy policy)
              </li>
              <li>
                <strong>Analytics:</strong> Privacy-focused analytics to
                understand how users interact with our service
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              These services do not have access to your uploaded content or
              generated mockups.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Access any personal data we hold about you</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of analytics tracking</li>
              <li>Export your account information</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Since all processing happens locally in your browser, your content
              is as secure as your device. We use industry-standard security
              measures to protect any account information we do store, including
              encryption in transit and at rest.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mockups.pics is not intended for children under 13 years of age.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at{" "}
              <a
                href="mailto:privacy@mockups.pics"
                className="text-primary hover:underline"
              >
                privacy@mockups.pics
              </a>
            </p>
          </section>
        </CardContent>
      </Card>

      {/* Trust Badge */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <ShieldCheckIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />

            <div className="space-y-1">
              <h3 className="font-semibold">Privacy-First Design</h3>
              <p className="text-sm text-muted-foreground">
                Mockups.pics is built with privacy as a core principle. Your
                content stays on your device, always. We believe in giving you
                full control over your creative work.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
