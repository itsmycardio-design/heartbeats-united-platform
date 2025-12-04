import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturedPostProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  read_time: string;
  image: string;
  author_name?: string;
  size?: "large" | "medium" | "small";
}

export const FeaturedPost = ({
  id,
  title,
  excerpt,
  category,
  created_at,
  read_time,
  image,
  author_name,
  size = "medium",
}: FeaturedPostProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
    };
    return categoryMap[cat.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  const sizeClasses = {
    large: "h-[500px] md:h-[600px]",
    medium: "h-[350px] md:h-[400px]",
    small: "h-[250px] md:h-[300px]",
  };

  return (
    <Link to={`/blog/${id}`} className="group block">
      <article
        className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden shadow-card hover:shadow-featured transition-all duration-300 featured-card`}
      >
        {/* Background Image */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-overlay" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <Badge className={`${getCategoryClass(category)} mb-3 text-xs font-medium`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>

          <h2
            className={`font-bold text-white mb-3 leading-tight ${
              size === "large"
                ? "text-2xl md:text-4xl"
                : size === "medium"
                ? "text-xl md:text-2xl"
                : "text-lg md:text-xl"
            }`}
          >
            {title}
          </h2>

          {size !== "small" && (
            <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-white/70 text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{read_time}</span>
            </div>
            {author_name && (
              <span className="hidden md:inline">By {author_name}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};