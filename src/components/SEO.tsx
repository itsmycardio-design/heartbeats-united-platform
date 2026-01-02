import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  category?: string;
}

const SITE_NAME = "Ukweli Media";
const DEFAULT_DESCRIPTION = "Your trusted source for authentic journalism, wellness insights, and inspiring stories.";
const DEFAULT_IMAGE = "/favicon.png";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Generate dynamic OG image URL using edge function
const generateOGImageUrl = (title: string, image: string, author: string, category: string): string => {
  if (!SUPABASE_URL) return image;
  
  const params = new URLSearchParams({
    title: title || SITE_NAME,
    image: image || '',
    author: author || SITE_NAME,
    category: category || '',
  });
  
  return `${SUPABASE_URL}/functions/v1/generate-og-image?${params.toString()}`;
};

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  author,
  publishedTime,
  category,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Truth in Every Story`;
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const baseImageUrl = image?.startsWith("http") ? image : `${typeof window !== "undefined" ? window.location.origin : ""}${image}`;
  
  // Use dynamic OG image for articles, fallback to original image for other pages
  const ogImageUrl = type === "article" && title
    ? generateOGImageUrl(title, baseImageUrl, author || SITE_NAME, category || '')
    : baseImageUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:site" content="@ukwelimedia" />
      
      {/* Article specific meta tags */}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && category && (
        <meta property="article:section" content={category} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};
