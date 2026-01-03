import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  image?: string;
  readTime: number;
  featured?: boolean;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  date,
  category,
  author,
  image,
  readTime,
  featured = false,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <Link
        to={`/blog/${slug}`}
        className="group no-underline block overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300"
      >
        {image && (
          <div className="overflow-hidden bg-muted h-64 sm:h-80">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
              {category}
            </span>
            <span className="text-xs text-muted-foreground">{readTime} min read</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-base text-muted-foreground mb-4">{excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{author}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            <ArrowRight className="h-5 w-5 text-accent group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${slug}`}
      className="group no-underline block overflow-hidden rounded-lg border border-border bg-card hover:shadow-md transition-all duration-300"
    >
      {image && (
        <div className="overflow-hidden bg-muted h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/10 text-accent">
            {category}
          </span>
          <span className="text-xs text-muted-foreground">{readTime} min</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{author}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-accent group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
