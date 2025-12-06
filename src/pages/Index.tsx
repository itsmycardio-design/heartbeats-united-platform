import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { NewsCard } from "@/components/news/NewsCard";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { CategoryBlock } from "@/components/news/CategoryBlock";

const Index = () => {
  usePageView("/");
  const navigate = useNavigate();
  const { posts: allPosts, loading } = useBlogPosts();

  const featuredPosts = allPosts.filter((post) => post.featured).slice(0, 4);
  const mainFeatured = featuredPosts[0] || allPosts[0];
  const sideFeatured = featuredPosts.length > 1 ? featuredPosts.slice(1, 4) : allPosts.slice(1, 4);
  const latestPosts = allPosts.slice(0, 10);

  // Group posts by category
  const healthPosts = allPosts.filter(p => p.category === "health").slice(0, 5);
  const fitnessPosts = allPosts.filter(p => p.category === "fitness").slice(0, 5);
  const politicsPosts = allPosts.filter(p => p.category === "politics").slice(0, 5);
  const lifestylePosts = allPosts.filter(p => p.category === "lifestyle").slice(0, 5);
  const educationPosts = allPosts.filter(p => p.category === "education").slice(0, 5);
  const inspirationPosts = allPosts.filter(p => p.category === "inspiration").slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breaking News Ticker */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary-dark px-2 py-0.5 text-xs font-bold uppercase shrink-0">BREAKING</span>
            <div className="overflow-hidden flex-1">
              <p className="text-sm truncate">
                {mainFeatured?.title || "Welcome to Ukweli Media - Your trusted source for authentic news"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-6 bg-primary"></span>
          <h2 className="text-lg font-bold uppercase">KENYA BREAKING NEWS</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Latest Column - Left */}
          <div className="lg:col-span-3">
            <div className="bg-primary px-3 py-2 mb-0">
              <h3 className="text-primary-foreground text-sm font-bold uppercase">LATEST</h3>
            </div>
            <div className="border border-border border-t-0 bg-card">
              {latestPosts.slice(0, 1).map((post) => (
                <NewsCard key={post.id} {...post} variant="medium" showExcerpt={false} />
              ))}
              <div className="p-3">
                {latestPosts.slice(1, 6).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="block py-3 border-b border-border last:border-b-0 group"
                  >
                    <h4 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
                      <span className="text-primary text-[10px] font-medium uppercase">
                        {post.category}
                      </span>
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(post.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Featured - Center */}
          <div className="lg:col-span-6">
            {mainFeatured && (
              <NewsCard
                {...mainFeatured}
                variant="large"
                showExcerpt={true}
              />
            )}
            
            {/* Secondary Stories Below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {sideFeatured.slice(0, 2).map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group flex gap-3">
                  <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-primary text-[10px] font-medium uppercase">{post.category}</span>
                    <h4 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors mt-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending - Right */}
          <div className="lg:col-span-3">
            <TrendingSidebar posts={allPosts} />
          </div>
        </div>
      </section>

      {/* Category Sections */}
      <div className="container mx-auto px-4">
        <CategoryBlock
          title="Health & Wellness"
          posts={healthPosts}
          categoryPath="/health"
          categoryColor="bg-emerald-600"
        />

        <CategoryBlock
          title="Fitness"
          posts={fitnessPosts}
          categoryPath="/fitness"
          categoryColor="bg-blue-600"
        />

        <CategoryBlock
          title="Politics"
          posts={politicsPosts}
          categoryPath="/politics"
          categoryColor="bg-purple-600"
        />

        <CategoryBlock
          title="Lifestyle"
          posts={lifestylePosts}
          categoryPath="/lifestyle"
          categoryColor="bg-pink-600"
        />

        <CategoryBlock
          title="Education"
          posts={educationPosts}
          categoryPath="/education"
          categoryColor="bg-amber-600"
        />

        <CategoryBlock
          title="Inspiration"
          posts={inspirationPosts}
          categoryPath="/inspiration"
          categoryColor="bg-orange-600"
        />
      </div>

      {/* More News Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="bg-secondary text-secondary-foreground px-3 py-1.5 text-sm font-bold uppercase">
            MORE NEWS
          </h2>
          <Link
            to="/blog"
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allPosts.slice(6, 14).map((post) => (
            <NewsCard key={post.id} {...post} variant="medium" />
          ))}
        </div>
      </section>
    </div>
  );
};

// Helper function
const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default Index;
