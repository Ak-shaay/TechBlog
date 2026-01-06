import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="prose dark:prose-invert max-w-none space-y-6">
          {/* 1. Interpretation and Definitions */}
          <section>
            <h2>Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>
              Words with capitalized initials have specific meanings under these Terms.
              These definitions apply whether the terms appear in singular or plural form.
            </p>

            <h3>Definitions</h3>
            <p>For the purposes of these Terms and Conditions:</p>
            <ul>
              <li>
                <strong>Affiliate</strong> means any entity that controls, is controlled by,
                or is under common control with a party, where “control” means ownership of
                at least 50% of the shares or voting rights.
              </li>
              <li>
                <strong>Country</strong> refers to Kerala, India.
              </li>
              <li>
                <strong>Company</strong> (referred to as “the Company”, “we”, “us”, or “our”)
                refers to TechTrendsAI.
              </li>
              <li>
                <strong>Device</strong> means any device that can access the Service,
                such as a computer, smartphone, or tablet.
              </li>
              <li>
                <strong>Service</strong> refers to the TechTrendsAI website and related content.
              </li>
              <li>
                <strong>Website</strong> refers to TechTrendsAI, accessible at
                {" "}
                <a href="https://www.techtrendsai.in" target="_blank" rel="noreferrer">
                  https://www.techtrendsai.in
                </a>
                .
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the Service, or
                the company or other legal entity on whose behalf that individual is
                accessing or using the Service.
              </li>
              <li>
                <strong>Third‑party Social Media Service</strong> means any third‑party
                platform, website, or content that may be integrated with, displayed on, or
                accessible through the Service.
              </li>
            </ul>
          </section>

          {/* 2. Acknowledgment */}
          <section>
            <h2>Acknowledgment</h2>
            <p>
              These Terms govern your use of TechTrendsAI and form a binding agreement
              between you and the Company. By accessing or using the Service, you agree to
              be bound by these Terms. If you do not agree with any part of the Terms, you
              must stop using the Service.
            </p>
            <p>
              The Service is not intended for individuals under the age of 13, and the
              Company does not knowingly collect, store, or process personal data from
              children.
            </p>
            <p>
              Your use of the Service is also subject to our Privacy Policy, which explains
              how we collect and use your personal data. Please review it carefully before
              using the Website.
            </p>
          </section>

          {/* 3. Intellectual Property Rights */}
          <section>
            <h2>Intellectual Property Rights</h2>
            <p>
              The Service and its original content (excluding any content provided by you
              or third parties), features, and functionality are and will remain the
              exclusive property of the Company and its licensors. The Service is protected
              by copyright, trademark, and other applicable laws in India and other
              jurisdictions.
            </p>
            <p>
              Our trademarks, logos, and trade dress may not be used in connection with any
              product or service without our prior written consent. Subject to these Terms,
              you are granted a limited, non‑exclusive, non‑transferable license to access
              and view the Website for personal, non‑commercial use only.
            </p>
          </section>

          {/* 4. Prohibited Uses */}
          <section>
            <h2>Prohibited Uses</h2>
            <p>
              You agree not to use the Service in any way that violates applicable local,
              national, or international laws or regulations.
            </p>
            <p>In particular, you agree not to:</p>
            <ul>
              <li>
                Use the Service to exploit, harm, or attempt to exploit or harm minors in
                any way.
              </li>
              <li>
                Send any unsolicited or unauthorized advertising, promotional material,
                junk mail, chain letters, spam, or similar solicitations.
              </li>
              <li>
                Impersonate or attempt to impersonate the Company, a Company employee,
                another user, or any other person or entity.
              </li>
              <li>
                Engage in conduct that restricts or inhibits anyone&apos;s use or enjoyment
                of the Service, or that may harm the Company or users of the Service or
                expose them to liability.
              </li>
            </ul>
            <p>Additionally, you agree not to:</p>
            <ul>
              <li>
                Use the Service in any manner that could disable, overburden, damage, or
                impair the Website or interfere with any other party&apos;s use of the
                Service.
              </li>
              <li>
                Use any robot, spider, or other automatic device or process to access,
                monitor, or copy any material on the Service.
              </li>
              <li>
                Introduce any viruses, trojan horses, worms, malware, or other harmful or
                technologically damaging material.
              </li>
            </ul>
          </section>

          {/* 5. Links to Other Websites */}
          <section>
            <h2>Links to Other Websites</h2>
            <p>
              The Website may contain links to third‑party websites or services that are
              not owned or controlled by the Company. The Company has no control over, and
              assumes no responsibility for, the content, privacy policies, or practices of
              any third‑party websites or services.
            </p>
            <p>
              You acknowledge and agree that the Company shall not be liable, directly or
              indirectly, for any damage or loss caused or alleged to be caused by or in
              connection with the use of or reliance on any such content, goods, or
              services available on or through any such websites or services.
            </p>
          </section>

          {/* 6. Termination */}
          <section>
            <h2>Termination</h2>
            <p>
              The Company may suspend or terminate your access to the Service at any time,
              without prior notice or liability, for any reason, including if you breach
              these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. Any
              provisions of these Terms that by their nature should survive termination
              (including limitation of liability and dispute resolution) will remain in
              effect.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, the Company and its
              directors, employees, partners, and affiliates shall not be liable for any
              indirect, incidental, special, or consequential damages, including but not
              limited to loss of data, loss of profits, loss of business, or business
              interruption arising out of or related to your use of the Service.
            </p>
            <p>
              In any event, the Company&apos;s total aggregate liability for any claim
              relating to your use of the Service will not exceed ₹5,000 INR or the amount
              you paid to access the Service (if any), whichever is higher.
            </p>
          </section>

          {/* 8. “AS IS” and “AS AVAILABLE” Disclaimer */}
          <section>
            <h2>“AS IS” and “AS AVAILABLE” Disclaimer</h2>
            <p>
              The Service is provided on an “AS IS” and “AS AVAILABLE” basis, without any
              warranties of any kind, whether express or implied. The Company does not
              warrant that the Service will be uninterrupted, error‑free, secure, or free
              of harmful components, or that any defects will be corrected.
            </p>
            <p>
              You use the Service at your own risk, and you are solely responsible for any
              damage to your Device or loss of data that results from your use of the
              Service.
            </p>
          </section>

          {/* 9. Governing Law and Disputes */}
          <section>
            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of India, specifically the applicable
              laws of the State of Kerala, without regard to conflict‑of‑law principles.
            </p>
          </section>

          <section>
            <h2>Dispute Resolution</h2>
            <p>
              If you have any concern or dispute about the Service, you agree to first
              contact the Company and attempt to resolve the matter informally. If a
              resolution cannot be reached, the dispute shall be subject to the exclusive
              jurisdiction of the competent courts in Kerala, India.
            </p>
          </section>

          {/* 10. Regional Provisions */}
          <section>
            <h2>For European Union Users</h2>
            <p>
              If you are a resident of the European Union, you will benefit from any
              mandatory provisions of the law of the country in which you are resident.
              Nothing in these Terms affects your rights under applicable EU consumer
              protection laws.
            </p>
          </section>

          <section>
            <h2>United States Legal Compliance</h2>
            <p>
              You represent and warrant that you are not located in a country that is
              subject to a U.S. government embargo, and that you are not listed on any U.S.
              government list of prohibited or restricted parties.
            </p>
          </section>

          {/* 11. Severability and Waiver */}
          <section>
            <h2>Severability and Waiver</h2>
            <h3>Severability</h3>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, that
              provision will be modified to the minimum extent necessary so that it remains
              enforceable, and the remaining provisions will continue in full force and
              effect.
            </p>

            <h3>Waiver</h3>
            <p>
              The failure of the Company to enforce any right or provision under these
              Terms shall not be considered a waiver of those rights. Any waiver of a
              provision will be effective only if it is in writing and signed by the
              Company.
            </p>
          </section>

          {/* 12. Translation */}
          <section>
            <h2>Translation Interpretation</h2>
            <p>
              These Terms may have been translated into other languages for your
              convenience. In the event of any conflict between the English version and a
              translated version, the English version shall prevail.
            </p>
          </section>

          {/* 13. Changes to These Terms */}
          <section>
            <h2>Changes to These Terms</h2>
            <p>
              The Company may update or modify these Terms from time to time. Any material
              changes will be posted on this page with an updated “Last updated” date at
              the top of the page.
            </p>
            <p>
              By continuing to access or use the Service after changes become effective,
              you agree to be bound by the revised Terms.
            </p>
          </section>

          {/* 14. Contact Us */}
          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, you can contact
              us:
            </p>
            <ul>
              <li>
                By email:{" "}
                <a href="mailto:creativeshub.tech@gmail.com">
                  creativeshub[dot]tech[at]gmail[dot]com
                </a>
              </li>
              <li>
                Via our contact page:{" "}
                <a href="/contact">
                  https://www.techtrendsai.in/contact
                </a>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </Layout>
  );
}
