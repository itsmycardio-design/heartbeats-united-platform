import { Link } from "react-router-dom";
import { TrendingUp, Clock, Eye } from "lucide-react";
import type { BlogPost } from "@/hooks/useBlogPosts";

interface TrendingSidebarProps {
  posts: BlogPost[];
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
  return categoryMap[cat.toLowerCase()] || "bg-muted text-foreground";
};

export const TrendingSidebar = ({ posts }: TrendingSidebarProps) => {
  const trendingPosts = posts.slice(0, 6);
  const featuredPost = posts.find(p => p.featured) || posts[0];

  return (
    <aside className="space-y-6">
      {/* Trending Section */}
      <div className="bg-card border border-border">
        <div className="bg-primary px-4 py-2">
          <h3 className="text-primary-foreground text-sm font-bold uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            TRENDING
          </h3>
        </div>
        
        {/* Featured Trending Post */}
        {featuredPost && (
          <Link to={`/blog/${featuredPost.id}`} className="block group">
            <div className="relative">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className={`${getCategoryClass(featuredPost.category)} px-2 py-1 text-xs font-medium inline-block mb-2`}>
                  {featuredPost.category.charAt(0).toUpperCase() + featuredPost.category.slice(1)}
                </span>
                <h4 className="text-white font-bold text-sm leading-tight line-clamp-3 group-hover:underline">
                  {featuredPost.title}
                </h4>
                <div className="flex items-center gap-2 text-white/70 text-xs mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(featuredPost.created_at)}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Trending List */}
        <div className="p-4">
          {trendingPosts.slice(1).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="block py-3 border-b border-border last:border-b-0 group"
            >
              <h4 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
                <span className={`${getCategoryClass(post.category)} px-1.5 py-0.5 text-[10px]`}>
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </span>
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(post.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Most Read Section */}
      <div className="bg-card border border-border">
        <div className="bg-secondary px-4 py-2">
          <h3 className="text-secondary-foreground text-sm font-bold uppercase flex items-center gap-2">
            <Eye className="w-4 h-4" />
            MOST READ
          </h3>
        </div>
        <div className="p-4">
          {posts.slice(0, 5).map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="flex items-start gap-3 py-3 border-b border-border last:border-b-0 group"
            >
              <span className="text-2xl font-bold text-primary/30 group-hover:text-primary transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {post.read_time}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-muted border border-border p-8 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">Advertisement</p>
        <div className="h-48 flex items-center justify-center">
          <span className="text-muted-foreground/50 text-sm">300x250 Ad Space</span>
        </div>
      </div>
    </aside>
  );
};
