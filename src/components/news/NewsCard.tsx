import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  read_time: string;
  image: string;
  author_name?: string;
  variant?: "large" | "medium" | "small" | "horizontal" | "compact";
  showExcerpt?: boolean;
  showImage?: boolean;
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getCategoryClass = (cat: string) => {
  const categoryMap: Record<string, string> = {
    fitness: "category-fitness",
    health: "category-health",
    politics: "category-politics",
    lifestyle: "category-lifestyle",
    education: "category-education",
    inspiration: "category-inspiration",
    quotes: "category-quotes",
    entertainment: "category-entertainment",
    sports: "category-sports",
    business: "category-business",
    world: "category-world",
  };
  return categoryMap[cat.toLowerCase()] || "bg-muted text-foreground";
};

export const NewsCard = ({
  id,
  title,
  excerpt,
  category,
  created_at,
  image,
  author_name,
  variant = "medium",
  showExcerpt = true,
  showImage = true,
}: NewsCardProps) => {
  // Large featured card - hero style
  if (variant === "large") {
    return (
      <Link to={`/blog/${id}`} className="block group">
        <article className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className={`${getCategoryClass(category)} px-2 py-1 text-xs font-medium inline-block mb-3`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:underline">
              {title}
            </h2>
            {showExcerpt && (
              <p className="text-white/80 text-sm line-clamp-2 mb-3">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(created_at)}</span>
              {author_name && (
                <>
                  <span>•</span>
                  <span>By {author_name}</span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Medium card - with image on top
  if (variant === "medium") {
    return (
      <Link to={`/blog/${id}`} className="block group">
        <article className="border-b border-border pb-4 hover:bg-muted/30 transition-colors">
          {showImage && (
            <div className="relative aspect-video overflow-hidden mb-3">
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <span className={`${getCategoryClass(category)} px-2 py-1 text-xs font-medium inline-block mb-2`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {showExcerpt && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
              {excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(created_at)}</span>
          </div>
        </article>
      </Link>
    );
  }

  // Small card - compact with small image
  if (variant === "small") {
    return (
      <Link to={`/blog/${id}`} className="block group">
        <article className="flex gap-3 py-3 border-b border-border hover:bg-muted/30 transition-colors">
          {showImage && (
            <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm leading-tight line-clamp-3 group-hover:text-primary transition-colors">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(created_at)}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Horizontal - side by side
  if (variant === "horizontal") {
    return (
      <Link to={`/blog/${id}`} className="block group">
        <article className="flex gap-4 py-4 border-b border-border hover:bg-muted/30 transition-colors">
          {showImage && (
            <div className="w-32 md:w-48 h-24 md:h-32 flex-shrink-0 overflow-hidden">
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className={`${getCategoryClass(category)} px-2 py-1 text-xs font-medium inline-block mb-2`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <h3 className="font-bold text-base md:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {showExcerpt && (
              <p className="text-muted-foreground text-sm line-clamp-2 mt-2 hidden md:block">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(created_at)}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Compact - text only
  return (
    <Link to={`/blog/${id}`} className="block group">
      <article className="py-3 border-b border-border hover:bg-muted/30 transition-colors">
        <h4 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
          <span className={`${getCategoryClass(category)} px-1.5 py-0.5 text-[10px]`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(created_at)}</span>
        </div>
      </article>
    </Link>
  );
};
