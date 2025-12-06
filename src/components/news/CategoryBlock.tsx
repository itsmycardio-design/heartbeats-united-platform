import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/hooks/useBlogPosts";

interface CategoryBlockProps {
  title: string;
  posts: BlogPost[];
  categoryPath: string;
  categoryColor?: string;
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const CategoryBlock = ({ title, posts, categoryPath, categoryColor = "bg-primary" }: CategoryBlockProps) => {
  if (posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 5);

  return (
    <section className="py-6 border-b border-border">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${categoryColor} text-primary-foreground px-3 py-1.5 text-sm font-bold uppercase`}>
          {title}
        </h2>
        <Link
          to={categoryPath}
          className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Post */}
        <div className="lg:col-span-2">
          <Link to={`/blog/${mainPost.id}`} className="block group">
            <article>
              <div className="relative aspect-video overflow-hidden mb-3">
                <img
                  src={mainPost.image}
                  alt={mainPost.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-xl md:text-2xl leading-tight mb-2 group-hover:text-primary transition-colors">
                {mainPost.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                {mainPost.excerpt}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(mainPost.created_at)}</span>
                {mainPost.author_name && (
                  <>
                    <span>•</span>
                    <span>By {mainPost.author_name}</span>
                  </>
                )}
              </div>
            </article>
          </Link>
        </div>

        {/* Side Posts */}
        <div className="space-y-0 divide-y divide-border">
          {sidePosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="flex gap-3 py-3 first:pt-0 last:pb-0 group"
            >
              <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm leading-tight line-clamp-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(post.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
