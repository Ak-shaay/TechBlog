import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground mb-6">
              Here are some helpful links instead:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors no-underline"
              >
                Return to Home
              </Link>
              <Link
                to="/blog"
                className="px-6 py-3 border border-border bg-card text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors no-underline"
              >
                Browse Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
