import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using TechBlog, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on TechBlog 
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on TechBlog</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2>3. Disclaimer</h2>
            <p>
              The materials on TechBlog are provided on an 'as is' basis. TechBlog makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions 
              of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2>4. Limitations</h2>
            <p>
              In no event shall TechBlog or its suppliers be liable for any damages (including, without limitation, damages for loss 
              of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TechBlog.
            </p>
          </section>

          <section>
            <h2>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on TechBlog could include technical, typographical, or photographic errors. TechBlog does not 
              warrant that any of the materials on TechBlog are accurate, complete, or current. TechBlog may make changes to the 
              materials contained on TechBlog at any time without notice.
            </p>
          </section>

          <section>
            <h2>6. Links</h2>
            <p>
              TechBlog has not reviewed all of the sites linked to its website and is not responsible for the contents of any such 
              linked site. The inclusion of any link does not imply endorsement by TechBlog of the site. Use of any such linked website 
              is at the user's own risk.
            </p>
          </section>

          <section>
            <h2>7. Modifications</h2>
            <p>
              TechBlog may revise these terms of service for its website at any time without notice. By using this website, you are 
              agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2>8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which 
              TechBlog operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at contact@techblog.com
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
