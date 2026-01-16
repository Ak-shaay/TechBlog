import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    schema?: any;
    noIndex?: boolean;
}

export default function SEO({
    title,
    description,
    image = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800',
    url = window.location.href,
    type = 'website',
    author = 'TechTrendsAI',
    schema,
    noIndex = false
}: SEOProps) {
    const siteTitle = 'TechTrendsAI';
    const baseUrl = import.meta.env.VITE_SITE_URL || 'https://techtrendsai.in';
    const fullTitle = `${title} | ${siteTitle}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="author" content={author} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            <link rel="canonical" href={url.startsWith('http') ? url : `${baseUrl}${url}`} />

            {/* AdSense readiness (Optional: add verify meta if needed) */}
            {/* <meta name="google-adsense-account" content="ca-pub-0000000000000000" /> */}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url.startsWith('http') ? url : `${baseUrl}${url}`} />
            <meta property="og:image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}
