import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: February 01, 2026
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>Introduction</h2>
            <p>
              We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, and social media profile information when you interact with our website or subscribe to updates. We collect only what is necessary to provide our services.
            </p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to communicate important updates via email and provide services that you request. We do not sell, rent, or trade your personal information to third parties.
            </p>
          </section>

          <section>
            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies to enhance your experience, analyze site traffic, and serve personalized advertisements. We use <strong>Ezoic</strong> and <strong>Gatekeeper Consent Manager</strong> to manage user consent and optimize ad delivery. These tools may use cookies to collect information about your browsing behavior.
            </p>
          </section>

          <section>
            <h2>Ezoic and Gatekeeper Consent</h2>
            <p>
              This website uses Ezoic to provide personalization and analytic services on this website, as such Ezoic's privacy policy is in effect and can be reviewed <a href="https://www.ezoic.com/privacy-policy/" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
            <p>
              We also use Gatekeeper Consent Manager to ensure compliance with privacy regulations like GDPR and CCPA. You can manage your consent preferences through the consent banner provided on our site.
            </p>
          </section>

          <section>
            <h2>Third-Party Advertising (Google AdSense)</h2>
            <p>
              We use Google AdSense to serve advertisements on our service. Google, as a third-party vendor, uses cookies (including the DART cookie) to serve ads based on a user&apos;s prior visits to our site and other sites on the internet. This enables Google and its partners to serve personalized ads to our users.
            </p>
          </section>

          <section>
            <h2>Payments</h2>
            <p>
              Our website does not currently accept payments for products or services.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, or destruction. While we strive to ensure security, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>Children&apos;s Privacy</h2>
            <p>
              We do not knowingly collect information from children under the age of 13.
            </p>
          </section>

          <section>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date to reflect the most recent version.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your personal data, please contact us at{" "}
              <a href="mailto:creativeshub.tech@gmail.com">creativeshub[dot]tech[at]gmail[dot]com
              </a>.
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
