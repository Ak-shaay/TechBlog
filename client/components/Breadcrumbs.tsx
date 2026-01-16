import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const baseUrl = import.meta.env.VITE_SITE_URL || 'https://techtrendsai.in';

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": item.label,
                "item": item.href ? (item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`) : undefined,
            })),
        ],
    };

    return (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 sm:pb-0">
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
            <Link
                to="/"
                className="flex items-center gap-1 hover:text-primary transition-colors no-underline"
            >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 opacity-50" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-primary transition-colors no-underline"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
