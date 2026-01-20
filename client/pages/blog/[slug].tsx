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
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: "-10% 0% -70% 0%" }
    );

    const headingElements = document.querySelectorAll("h2[id], h3[id]");
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [post]);

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

  // Helper to generate consistent IDs for headings
  const generateId = (text: string) => text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  // Extract headings for table of contents
  const headings = post.content
    ? post.content
      .split("\n")
      .filter((line: string) => line.startsWith("## ") || line.startsWith("### "))
      .map((line: string) => {
        const level = line.startsWith("### ") ? 3 : 2;
        const text = line.replace(/^#+\s/, "").trim();
        const id = generateId(text);
        return { level, text, id };
      })
    : [];

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://techtrendsai.in';
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`
    },
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
        "url": `${baseUrl}/icon.png`
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
        url={`/blog/${slug}`}
        schema={schema}
      />
      {/* Article Header */}
      <section className="bg-gradient-to-br from-background to-card pt-8 pb-4">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 font-medium no-underline bg-transparent border-none cursor-pointer self-start sm:self-center"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          <div className="mb-6">
            <span className="text-sm font-semibold px-4 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
              {post.category || 'General'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight text-foreground">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96 shadow-xl">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pb-8 border-b border-border/50">
            <div className="flex items-center gap-2">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover shadow-sm" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="font-medium text-foreground">{post.authorName || 'Unknown'}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Body */}
            <article className="prose dark:prose-invert prose-sm sm:prose-base max-w-none mb-12 text-justify">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => <img {...props} className="rounded-lg border border-border my-8 w-full shadow-md" />,
                  h2: ({ node, children, ...props }) => {
                    const id = generateId(String(children));
                    return <h2 id={id} {...props} className="scroll-mt-24 text-2xl font-bold border-b border-border/30 pb-2 mb-6">{children}</h2>;
                  },
                  h3: ({ node, children, ...props }) => {
                    const id = generateId(String(children));
                    return <h3 id={id} {...props} className="scroll-mt-24 text-xl font-semibold mb-4">{children}</h3>;
                  },
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="my-6 ml-6 list-disc space-y-2 text-foreground" />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol {...props} className="my-6 ml-6 list-decimal space-y-2 text-foreground" />
                  ),
                  li: ({ node, ...props }) => (
                    <li {...props} className="leading-7 text-muted-foreground" />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="my-8 w-full overflow-x-auto rounded-xl border border-border shadow-sm overflow-hidden">
                      <table {...props} className="w-full border-collapse text-left text-sm m-0" />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead {...props} className="bg-secondary/50 font-semibold" />
                  ),
                  th: ({ node, ...props }) => (
                    <th {...props} className="border-b border-border px-4 py-4 font-bold text-foreground first:pl-6 last:pr-6" />
                  ),
                  td: ({ node, ...props }) => (
                    <td {...props} className="border-b border-border/40 px-4 py-4 text-muted-foreground first:pl-6 last:pr-6" />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr {...props} className="hover:bg-muted/30 transition-colors last:border-0" />
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Tags (if any exist) */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12 pb-12 border-b border-border/50">
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-1 rounded-full bg-secondary border border-border/50 text-sm text-foreground hover:bg-secondary/80 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Section */}
            <div className="bg-card border border-border rounded-xl p-8 mb-12 flex flex-col sm:flex-row gap-8 items-start shadow-sm hover:shadow-md transition-shadow">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName} className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-md">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-foreground">{post.authorName}</h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                  {post.authorBio || 'Tech enthusiast and software developer sharing insights on the latest trends and technologies.'}
                </p>

                {post.authorSocials && (
                  <div className="flex flex-wrap gap-5">
                    {Object.entries(post.authorSocials).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform opacity-80 hover:opacity-100"
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
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
                <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-3">Table of Contents</h3>
                <nav className="space-y-3 text-sm">
                  {headings.map((heading, idx) => (
                    <a
                      key={idx}
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(heading.id);
                        if (el) {
                          const yOffset = -100;
                          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                      className={`block transition-all hover:translate-x-1 no-underline ${heading.level === 3 ? "ml-4 opacity-80" : "font-medium"
                        } ${activeId === heading.id ? "text-primary border-l-2 border-primary pl-3 -ml-3" : "text-muted-foreground hover:text-foreground"}`}
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
