import { Helmet } from 'react-helmet-async';
import { useSiteContent } from '../hooks/useSiteContent';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    article?: {
        publishedTime?: string;
        author?: string;
    };
}

const defaultSEO = {
    siteName: 'EVFARM India',
    title: 'EVFARM India | Premium Electric Golf Carts & Utility Vehicles',
    description: "India's leading manufacturer of premium electric golf carts and utility vehicles. Experience sustainable luxury with zero emissions for resorts, campuses, and gated communities.",
    keywords: 'electric golf carts, Golfcart, Electric buggy, Club Car, EV golf carts, luxury golf carts India, electric utility vehicles, EVFARM, sustainable mobility',
    image: 'https://evfarm.in/og-image.png',
    url: 'https://evfarm.in',
};

export function SEO({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    article
}: SEOProps) {
    const { content } = useSiteContent();
    const seoTitle = title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.title;
    const seoDescription = description || defaultSEO.description;
    const seoKeywords = keywords || defaultSEO.keywords;
    const seoImage = image || content.siteLogo || defaultSEO.image;
    const seoUrl = url || defaultSEO.url;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="title" content={seoTitle} />
            <meta name="description" content={seoDescription} />
            <meta name="keywords" content={seoKeywords} />
            <link rel="canonical" href={seoUrl} />

            {/* Dynamic Favicon & Logo */}
            <link rel="icon" type="image/png" href={seoImage} />
            <link rel="apple-touch-icon" href={seoImage} />
            <meta name="msapplication-TileImage" content={seoImage} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:site_name" content={defaultSEO.siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={seoUrl} />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDescription} />
            <meta name="twitter:image" content={seoImage} />

            {/* Structured Data override */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "EVFARM India",
                    "url": "https://evfarm.in",
                    "logo": seoImage,
                    "image": seoImage,
                    "description": seoDescription
                })}
            </script>

            {/* Article specific */}
            {type === 'article' && article?.publishedTime && (
                <meta property="article:published_time" content={article.publishedTime} />
            )}
            {type === 'article' && article?.author && (
                <meta property="article:author" content={article.author} />
            )}
        </Helmet>
    );
}
