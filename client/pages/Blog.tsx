import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  // Initialize page from URL
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ name: string, count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state when URL params change
  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogPosts(data);
        // Calculate categories dynamically
        const catMap = new Map<string, number>();
        data.forEach((post: any) => {
          const cat = post.category || 'General';
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
        });
        const catArray = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
        setCategories(catArray);
      } else {
        console.error("Invalid data format", data);
        toast.error("Failed to load blogs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        (post.category || 'General').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, blogPosts]);

  // Paginate posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    // Reset to page 1 on category change
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (category) newParams.set("category", category);
      else newParams.delete("category");
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Reset to page 1 on search
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
    // Scroll behavior handled by effect/router or manual
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <Layout>
      <div className="container mx-auto py-20 text-center">Loading articles...</div>
    </Layout>
  );

  return (
    <Layout>
      <SEO
        title="Blog"
        description="Explore articles on technology, development, and innovation."
      />
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-background to-card">
        <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Explore {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} on technology,
            development, and innovation.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${!selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground"
                    }`}
                >
                  All Articles ({blogPosts.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${selectedCategory === category.name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                      }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {paginatedPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {paginatedPosts.map((post) => {
                    const stripMarkdown = (markdown: string) => { // Keeping here for minimal diff, effectively hoisted by engine anyway but cleaner to move out.
                      if (!markdown) return "";
                      return markdown
                        .replace(/[#*`_~]/g, '')
                        .replace(/!\[.*?\]\(.*?\)/g, '')
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                        .replace(/\n+/g, ' ')
                        .trim();
                    };

                    return (
                      <BlogCard
                        key={post._id}
                        slug={post.slug || post._id}
                        title={post.title}
                        excerpt={post.excerpt || stripMarkdown(post.content).substring(0, 100) + '...'}
                        date={new Date(post.createdAt).toLocaleDateString()}
                        category={post.category || 'General'}
                        author={{
                          name: post.authorName || 'Unknown',
                          image: post.authorAvatar
                        }}
                        image={post.image}
                        readTime="5 min read" // Placeholder or calc
                      />
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="space-y-4">
                    {/* ... Pagination UI ... */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? `No articles match "${searchQuery}".`
                    : "Try selecting a different category."}
                </p>
                <button
                  onClick={() => { handleSearchChange(""); handleCategoryChange(""); }}
                  className="px-6 py-2 bg-secondary text-foreground font-semibold rounded-lg hover:bg-card border border-border transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout >
  );
}
