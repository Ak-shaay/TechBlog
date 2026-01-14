import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Calendar, Linkedin, Instagram, Facebook, Twitter, Github, Youtube } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetch(`/api/blogs/${slug}`)
        .then(res => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then(data => {
          setPost({
            ...data,
            date: data.createdAt,
            // Calculate read time roughly
            readTime: data.content ? Math.ceil(data.content.split(' ').length / 200) + " min read" : "1 min read",
            tags: data.tags || ["Tech", "Code"],
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  // Next/Prev/Related logic placeholder
  const previousPost = null;
  const nextPost = null;
  const relatedPosts: any[] = [];

  const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-600" />;
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-800" />;
      case 'twitter': return <Twitter className="w-5 h-5 text-sky-500" />;
      case 'github': return <Github className="w-5 h-5 text-gray-800" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">Loading...</div>
      </Layout>
    );
  }

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
    ? post.content
      .split("\n")
      .filter((line: string) => line.startsWith("## ") || line.startsWith("### "))
      .map((line: string) => {
        const level = line.startsWith("### ") ? 3 : 2;
        const text = line.replace(/^#+\s/, "").trim();
        const id = text.toLowerCase().replace(/\s+/g, "-");
        return { level, text, id };
      })
    : [];

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.authorName || "TechTrendsAI"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechTrendsAI",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/icon.png`
      }
    },
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "description": post.excerpt || post.content.substring(0, 150)
  };

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.excerpt || post.content.substring(0, 150)}
        image={post.image}
        author={post.authorName}
        type="article"
        schema={schema}
      />
      {/* Article Header */}
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 font-medium mb-4 no-underline bg-transparent border-none cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          <div className="mb-6">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
              {post.category || 'General'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Featured Image */}
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
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>{post.authorName || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => <img {...props} className="rounded-lg border border-border my-6 w-full" />
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Tags (if any exist) */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12 pb-12 border-b border-border">
                <h3 className="text-sm font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
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

            {/* Author Bio Section */}
            <div className="bg-card border border-border rounded-lg p-6 mb-12 flex flex-col sm:flex-row gap-6 items-start">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName} className="w-20 h-20 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{post.authorName}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {post.authorBio || 'No bio available.'}
                </p>

                {post.authorSocials && (
                  <div className="flex gap-4">
                    {Object.entries(post.authorSocials).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform"
                          aria-label={`Visit ${platform}`}
                        >
                          <SocialIcon platform={platform} />
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
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
                      className={`block transition-colors text-muted-foreground hover:text-primary no-underline ${heading.level === 3 ? "ml-4" : ""
                        }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

          </aside>
        </div>
      </div>
    </Layout>
  );
}
