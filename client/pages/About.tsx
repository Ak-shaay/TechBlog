import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About TechBlog</h1>
          <p className="text-xl text-muted-foreground">
            Learn more about our mission and expertise in technology.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <article className="prose prose-invert max-w-none mb-12">
          <h2>Our Mission</h2>
          <p>
            TechBlog is dedicated to providing high-quality, in-depth articles on modern technology, 
            software development, artificial intelligence, cloud infrastructure, and cybersecurity.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li><strong>Software Development:</strong> Best practices, design patterns, and modern frameworks</li>
            <li><strong>AI & Machine Learning:</strong> Applications, tools, and emerging trends</li>
            <li><strong>Web Technologies:</strong> Frontend, backend, full-stack development</li>
            <li><strong>Cloud & DevOps:</strong> Infrastructure, containerization, deployment strategies</li>
            <li><strong>Cybersecurity:</strong> Vulnerabilities, security practices, and threat analysis</li>
            <li><strong>Tools & Technologies:</strong> Reviews and deep dives into developer tools</li>
          </ul>

          <h2>Our Expertise</h2>
          <p>
            Our team consists of experienced developers, engineers, and technology specialists with years 
            of practical experience in their respective fields. We're passionate about sharing knowledge 
            and helping others stay ahead in the rapidly evolving tech landscape.
          </p>

          <h2>Why Choose TechBlog?</h2>
          <ul>
            <li>In-depth technical analysis and practical insights</li>
            <li>Content written by industry experts</li>
            <li>Focus on actionable advice and real-world applications</li>
            <li>Regular updates with the latest technology trends</li>
            <li>Quality over quantity - thoroughly researched articles</li>
          </ul>
        </article>

        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to Know More?</h3>
          <p className="text-muted-foreground mb-6">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <Link
            to="/contact"
            className="inline-flex px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors no-underline"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </Layout>
  );
}
