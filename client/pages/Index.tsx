import { Link } from "react-router-dom";
import { ArrowRight, Zap, Code, Shield, Cloud, Sparkles, BookOpen, Inbox } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import CategoryChip from "@/components/CategoryChip";
import { blogPosts, categories } from "@/data/blog-posts";

export default function Index() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-card">
        <div className="container mx-auto max-w-6xl px-4 py-20 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                ✨ Welcome to TechBlog
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Insights on Modern Tech & Software Development
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Deep dives into AI, web development, cloud infrastructure, security, and emerging technologies. 
              Stay ahead with expert analysis and practical insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors no-underline"
              >
                Explore Blog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border bg-card text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors no-underline"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Articles</h2>
              <p className="text-lg text-muted-foreground">
                Our most popular and in-depth technical articles
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.slug} {...post} featured={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 sm:py-24 bg-secondary border-t border-b border-border">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find articles on topics that interest you
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CategoryChip
              name="All Articles"
              count={blogPosts.length}
              isSelected={true}
              icon={<BookOpen className="h-4 w-4" />}
            />
            {[
              { name: "AI & ML", icon: <Zap className="h-4 w-4" /> },
              { name: "Web Dev", icon: <Code className="h-4 w-4" /> },
              { name: "Security", icon: <Shield className="h-4 w-4" /> },
              { name: "Cloud", icon: <Cloud className="h-4 w-4" /> },
            ].map((cat) => (
              <CategoryChip
                key={cat.name}
                name={cat.name}
                icon={cat.icon}
                count={categories.find((c) => c.name === cat.name)?.count || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Latest Articles</h2>
              <p className="text-lg text-muted-foreground">
                Fresh perspectives on the latest tech trends
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all no-underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
          <div className="sm:hidden">
            <Link
              to="/blog"
              className="block w-full px-6 py-3 bg-secondary text-foreground font-semibold rounded-lg hover:bg-card transition-colors text-center no-underline border border-border"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Inbox className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter for weekly insights on technology, development, and innovation.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Subscribe
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-lg border border-border bg-card p-8 sm:p-12 text-center overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Sparkles className="h-32 w-32 text-primary" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Dive Deeper?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore our comprehensive collection of articles covering everything from AI and machine learning
                to cloud infrastructure and security best practices.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors no-underline"
              >
                Browse All Articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
