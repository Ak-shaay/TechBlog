import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Code, Shield, Cloud, Sparkles, BookOpen, Inbox } from "lucide-react";
import Layout from "@/components/Layout";
import { SubscribeForm } from "@/components/SubscribeForm";

import BlogCard from "@/components/BlogCard";
import CategoryChip from "@/components/CategoryChip";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(err => console.error(err));
  }, []);

  const stripMarkdown = (markdown: string) => {
    if (!markdown) return "";
    return markdown
      .replace(/[#*`_~]/g, '') // Remove simple chars
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
  };

  const mapPost = (post: any) => ({
    slug: post.slug || post._id,
    title: post.title,
    excerpt: post.excerpt || stripMarkdown(post.content).substring(0, 150) + "...",
    date: post.createdAt,
    category: post.category || "General",
    author: post.author?.username || "Unknown",
    image: post.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800",
    readTime: post.content ? `${Math.ceil(post.content.split(' ').length / 200)} min read` : "1 min read",
    featured: false
  });

  const featuredPosts = posts.slice(0, 1).map(mapPost);
  const latestPosts = posts.slice(0, 3).map(mapPost); // Just show first 3 as latest/featured overlay logic might differ

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TechTrendsAI",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/blog?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Layout>
      <SEO
        title="Home"
        description="Insights on Modern Tech & Software Development. Deep dives into AI, web development, cloud infrastructure, and security."
        schema={schema}
      />
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-card">
        <div className="container mx-auto max-w-6xl px-4 py-20 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                ✨ Welcome to TechTrendsAI
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
              count={posts.length}
              isSelected={true}
              icon={<BookOpen className="h-4 w-4" />}
              onClick={() => navigate('/blog')}
            />
            {(() => {
              const catMap = new Map<string, number>();
              posts.forEach((post) => {
                const cat = post.category || 'General';
                catMap.set(cat, (catMap.get(cat) || 0) + 1);
              });
              return Array.from(catMap.entries()).map(([name, count]) => {
                let Icon = Zap;
                const lowerName = name.toLowerCase();
                if (lowerName.includes('web')) Icon = Code;
                else if (lowerName.includes('security')) Icon = Shield;
                else if (lowerName.includes('cloud')) Icon = Cloud;
                else if (lowerName.includes('ai') || lowerName.includes('machine')) Icon = Zap;
                else Icon = Sparkles;

                return (
                  <CategoryChip
                    key={name}
                    name={name}
                    icon={<Icon className="h-4 w-4" />}
                    count={count}
                    onClick={() => navigate(`/blog?category=${encodeURIComponent(name)}`)}
                  />
                );
              });
            })()}
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
          <SubscribeForm className="max-w-md mx-auto" variant="hero" />
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
