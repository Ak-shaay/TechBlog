import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Calendar } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blog-posts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  // Find the current post
  const post = useMemo(
    () => blogPosts.find((p) => p.slug === slug),
    [slug]
  );

  // Find adjacent posts for navigation
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Find related posts (same category, excluding current)
  const relatedPosts = useMemo(
    () =>
      post
        ? blogPosts
            .filter((p) => p.category === post.category && p.slug !== post.slug)
            .slice(0, 3)
        : [],
    [post]
  );

  if (!post) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link
              to="/blog"
              className="inline-flex px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors no-underline"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Extract headings for table of contents
  const headings = post.content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const text = line.replace(/^#+\s/, "").trim();
      const id = text.toLowerCase().replace(/\s+/g, "-");
      return { level, text, id };
    });

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      {/* Article Header */}
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 font-medium mb-4 no-underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <div className="mb-6">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Body */}
            <article className="prose dark:prose-invert prose-sm sm:prose-base max-w-none mb-12">
              {post.content.split("\n").map((paragraph, idx) => {
                if (paragraph.startsWith("## ")) {
                  const text = paragraph.replace(/^## /, "").trim();
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <h2 key={idx} id={id} className="scroll-mt-20">
                      {text}
                    </h2>
                  );
                } else if (paragraph.startsWith("### ")) {
                  const text = paragraph.replace(/^### /, "").trim();
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <h3 key={idx} id={id} className="scroll-mt-20">
                      {text}
                    </h3>
                  );
                } else if (paragraph.startsWith("```")) {
                  // Skip code blocks in this simple parsing
                  return null;
                } else if (paragraph.trim()) {
                  return <p key={idx}>{paragraph}</p>;
                }
                return null;
              })}
            </article>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-12 pb-12 border-b border-border">
                <h3 className="text-sm font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-secondary text-sm text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="bg-card border border-border rounded-lg p-6 mb-12">
              <h3 className="font-bold mb-2">{post.author}</h3>
              <p className="text-sm text-muted-foreground">{post.authorBio}</p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {previousPost ? (
                <Link
                  to={`/blog/${previousPost.slug}`}
                  className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors no-underline group"
                >
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    ← Previous Article
                  </div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {previousPost.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors no-underline group text-right"
                >
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    Next Article →
                  </div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {nextPost.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="sticky top-20 bg-card border border-border rounded-lg p-6 mb-8">
                <h3 className="font-bold mb-4 text-sm">Table of Contents</h3>
                <nav className="space-y-2 text-sm">
                  {headings.map((heading, idx) => (
                    <a
                      key={idx}
                      href={`#${heading.id}`}
                      className={`block transition-colors text-muted-foreground hover:text-primary no-underline ${
                        heading.level === 3 ? "ml-4" : ""
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Share */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-4 text-sm">Share</h3>
              <div className="space-y-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-secondary hover:bg-accent/10 rounded-lg text-sm font-medium transition-colors text-center text-foreground hover:text-accent"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-secondary hover:bg-accent/10 rounded-lg text-sm font-medium transition-colors text-center text-foreground hover:text-accent"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border py-16 sm:py-24 bg-secondary">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold mb-12">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} {...relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
