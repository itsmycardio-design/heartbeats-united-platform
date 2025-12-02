import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, TrendingUp, Tag, Mail, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/hooks/useBlogPosts";

interface SidebarWidgetProps {
  posts: BlogPost[];
  categories: string[];
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
}

export const RecentPostsWidget = ({ posts }: { posts: BlogPost[] }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <h3 className="font-poppins font-bold text-lg mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        Recent Posts
      </h3>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="flex gap-3 group"
          >
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="w-16 h-16 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-inter text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(post.created_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const PopularPostsWidget = ({ posts }: { posts: BlogPost[] }) => {
  // Use featured posts or first 5 as "popular"
  const popularPosts = posts.filter(p => p.featured).slice(0, 5);
  const displayPosts = popularPosts.length > 0 ? popularPosts : posts.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <h3 className="font-poppins font-bold text-lg mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        Popular Posts
      </h3>
      <div className="space-y-3">
        {displayPosts.map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="flex items-start gap-3 group"
          >
            <span className="font-poppins font-bold text-2xl text-muted-foreground/50 group-hover:text-primary transition-colors">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-inter text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{post.read_time}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const CategoriesWidget = ({
  categories,
  posts,
  onCategorySelect,
  selectedCategory,
}: {
  categories: string[];
  posts: BlogPost[];
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
}) => {
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

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <h3 className="font-poppins font-bold text-lg mb-4 flex items-center gap-2">
        <Tag className="w-4 h-4 text-primary" />
        Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.filter(cat => cat !== "All").map((cat) => {
          const count = posts.filter((p) => p.category === cat).length;
          if (count === 0) return null;
          const isSelected = selectedCategory === cat;
          return (
            <Badge
              key={cat}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : `hover:${getCategoryClass(cat)}`
              }`}
              onClick={() => onCategorySelect?.(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export const NewsletterWidget = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("subscribers").insert([{ email }]);
      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: "You've been added to our newsletter.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-5 shadow-card">
      <Mail className="w-8 h-8 mb-3" />
      <h3 className="font-poppins font-bold text-lg mb-2">Newsletter</h3>
      <p className="text-sm opacity-90 mb-4">
        Get the latest stories delivered to your inbox weekly.
      </p>
      <form onSubmit={handleSubscribe} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-primary hover:bg-white/90 font-poppins font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </div>
  );
};

export const Sidebar = ({ posts, categories, onCategorySelect, selectedCategory }: SidebarWidgetProps) => {
  return (
    <aside className="space-y-6">
      <NewsletterWidget />
      <CategoriesWidget
        categories={categories}
        posts={posts}
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
      />
      <PopularPostsWidget posts={posts} />
      <RecentPostsWidget posts={posts} />
    </aside>
  );
};
