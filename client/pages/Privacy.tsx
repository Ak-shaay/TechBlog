import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. Introduction</h2>
            <p>
              TechBlog ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, and other contact information you provide</li>
              <li><strong>Usage Information:</strong> Pages visited, time spent, and interaction patterns</li>
              <li><strong>Device Information:</strong> IP address, browser type, and operating system</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Improve and maintain our website</li>
              <li>Send you newsletters and updates (with your consent)</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Respond to your inquiries and requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>
              We may use third-party services such as Google Analytics to track and analyze website usage. 
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2>5. AdSense</h2>
            <p>
              TechBlog uses Google AdSense to display advertisements. Google may use cookies to serve ads based 
              on your prior visits to our website or other websites. You can opt out of personalized advertising 
              through Google's Ad Settings.
            </p>
          </section>

          <section>
            <h2>6. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. However, no method 
              of transmission over the Internet or electronic storage is completely secure.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. To exercise these rights, 
              please contact us at contact@techblog.com.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by updating 
              the "Last updated" date above.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at contact@techblog.com
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
