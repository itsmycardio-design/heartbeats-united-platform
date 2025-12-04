import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  read_time: string;
  image: string;
  author_id?: string;
  author_name?: string;
  variant?: "default" | "horizontal" | "compact";
}

export const PostCard = ({
  id,
  title,
  excerpt,
  category,
  created_at,
  read_time,
  image,
  author_name,
  variant = "default",
}: PostCardProps) => {
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

  if (variant === "horizontal") {
    return (
      <article className="group bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
        <Link to={`/blog/${id}`} className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <Badge className={`absolute top-3 left-3 ${getCategoryClass(category)} text-xs`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          </div>
          <div className="flex flex-col justify-between p-5 flex-1">
            <div>
              <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(created_at)}</span>
                <span>•</span>
                <span>{read_time}</span>
              </div>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Read <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link to={`/blog/${id}`} className="flex gap-3">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1.5">
              {formatDate(created_at)}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
      <Link to={`/blog/${id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className={`absolute top-3 left-3 ${getCategoryClass(category)} text-xs font-medium`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{read_time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {author_name || "Ukweli Media"}
            </span>
            <span className="flex items-center gap-1 text-primary text-xs font-medium group-hover:gap-2 transition-all">
              Read More
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};