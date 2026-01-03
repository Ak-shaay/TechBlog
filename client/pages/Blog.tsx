import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import CategoryChip from "@/components/CategoryChip";
import { blogPosts, categories } from "@/data/blog-posts";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  // Paginate posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setSearchParams(category ? { category } : {});
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
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
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                    !selectedCategory
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
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                      selectedCategory === category.name
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
                  {paginatedPosts.map((post) => (
                    <BlogCard key={post.slug} {...post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="space-y-4">
                    {/* Page info */}
                    <div className="text-sm text-muted-foreground text-center">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} articles
                      {searchQuery && ` (filtered by "${searchQuery}")`}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers - show max 5 at a time */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            const diff = Math.abs(page - currentPage);
                            return diff === 0 || diff <= 1 || page === 1 || page === totalPages;
                          })
                          .map((page, idx, arr) => (
                            <div key={page} className="flex items-center gap-1">
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="text-muted-foreground">...</span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                                  currentPage === page
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-border hover:bg-secondary"
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
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
                    ? `No articles match "${searchQuery}". Try a different search term.`
                    : "Try selecting a different category or check back soon for new content."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="px-6 py-2 bg-secondary text-foreground font-semibold rounded-lg hover:bg-card border border-border transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategoryChange("")}
                      className="px-6 py-2 bg-secondary text-foreground font-semibold rounded-lg hover:bg-card border border-border transition-colors"
                    >
                      View All Articles
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
