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
}: PostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (cat: string) => {
    const categoryMap: Record<string, string> = {
      fitness: "bg-primary/10 text-primary border-primary/20",
      health: "bg-secondary/10 text-secondary border-secondary/20",
      politics: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300",
      lifestyle: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300",
    };
    return categoryMap[cat.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  return (
    <article className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-in">
      <Link to={`/blog/${id}`} className="block">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-card" />
          <Badge className={`absolute top-4 left-4 ${getCategoryColor(category)} font-poppins font-medium`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-4 mb-3 font-inter text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{read_time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-poppins font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="font-inter text-sm text-muted-foreground line-clamp-3 mb-4">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="font-inter text-sm text-muted-foreground">
              By {author_name || "Ukweli Media Team"}
            </span>
            <div className="flex items-center gap-1 text-primary font-inter text-sm font-medium group-hover:gap-2 transition-all">
              Read More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
