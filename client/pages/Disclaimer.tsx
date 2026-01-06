import Layout from "@/components/Layout";

export default function Disclaimer() {
  return (
    <Layout>
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. General Disclaimer</h2>
            <p>
              The information provided on TechTrendsAI is for educational and informational purposes only. While we strive to provide 
              accurate and up-to-date information, TechTrendsAI makes no representations or warranties of any kind, express or implied, 
              about the completeness, accuracy, reliability, suitability, or availability with respect to the content.
            </p>
          </section>

          <section>
            <h2>2. Technical Accuracy</h2>
            <p>
              Technology evolves rapidly, and while we make our best efforts to keep content current, some information may become 
              outdated. Always verify technical information with official documentation and test code in your own environment before 
              using it in production systems.
            </p>
          </section>

          <section>
            <h2>3. Professional Advice</h2>
            <p>
              The articles and tutorials on TechTrendsAI are not professional advice. If you require professional advice regarding software 
              development, cybersecurity, or any other technical matter, please consult with qualified professionals.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Content</h2>
            <p>
              TechTrendsAI may include links to third-party websites and resources. We are not responsible for the content, accuracy, or 
              practices of these external sites. Your use of third-party websites is subject to their terms and conditions.
            </p>
          </section>

          <section>
            <h2>5. Security and Data Protection</h2>
            <p>
              Code examples and architectural patterns discussed on TechTrendsAI are provided as-is. While we strive to ensure security best 
              practices are discussed, you are responsible for implementing proper security measures in your applications. Conduct 
              security audits and follow industry standards for your specific use cases.
            </p>
          </section>

          <section>
            <h2>6. No Warranty</h2>
            <p>
              The materials and information provided on TechTrendsAI are provided on an "AS IS" basis without any warranty of any kind, 
              either express or implied. TechTrendsAI disclaims all warranties, including merchantability, fitness for a particular purpose, 
              and non-infringement.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall TechTrendsAI, its authors, or contributors be liable for any indirect, incidental, special, consequential, 
              or punitive damages, or any damages whatsoever resulting from the use or inability to use the materials on TechTrendsAI.
            </p>
          </section>

          <section>
            <h2>8. Affiliate Links</h2>
            <p>
              TechTrendsAI may contain affiliate links to products and services. We may earn a commission if you click on these links and 
              make a purchase. This does not affect the price you pay and helps support the continued operation of TechTrendsAI.
            </p>
          </section>

          <section>
            <h2>9. AdSense Disclaimer</h2>
            <p>
              TechTrendsAI displays advertisements through Google AdSense. Google may use cookies and other technologies to serve ads based 
              on your prior visits. We are not responsible for the content of these advertisements.
            </p>
          </section>

          <section>
            <h2>10. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Your continued use of TechTrendsAI constitutes acceptance of 
              any changes to this disclaimer.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              If you have questions about this Disclaimer, please contact us at creativeshub.tech@gmail.com

            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
