import { useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { FeaturedPost } from "@/components/magazine/FeaturedPost";
import { Sidebar, NewsletterWidget } from "@/components/magazine/SidebarWidgets";
import { Button } from "@/components/ui/button";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Link } from "react-router-dom";

const categories = ["All", "fitness", "health", "politics", "lifestyle", "education", "inspiration", "quotes"];

const Index = () => {
  usePageView("/");
  const navigate = useNavigate();
  const { posts: allPosts, loading } = useBlogPosts();

  // Separate posts
  const featuredPosts = allPosts.filter((post) => post.featured).slice(0, 4);
  const latestPosts = allPosts.slice(0, 9);
  const trendingPosts = allPosts.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-inter">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Featured Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main Featured Post */}
          {featuredPosts[0] && (
            <FeaturedPost {...featuredPosts[0]} size="large" />
          )}

          {/* Secondary Featured Posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredPosts.slice(1, 3).map((post) => (
              <FeaturedPost key={post.id} {...post} size="medium" />
            ))}
            {featuredPosts[3] && (
              <div className="sm:col-span-2">
                <FeaturedPost {...featuredPosts[3]} size="small" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-poppins font-bold text-2xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Latest Stories
              </h2>
              <Link to="/blog">
                <Button variant="ghost" className="text-primary font-inter text-sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Posts Grid - 2 columns on md, 3 on xl */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  {...post}
                  variant="default"
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-10">
              <Button
                onClick={() => navigate("/blog")}
                variant="outline"
                size="lg"
                className="font-poppins"
              >
                Explore All Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <Sidebar
                posts={allPosts}
                categories={categories}
                onCategorySelect={(cat) => navigate(`/blog?category=${cat}`)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-poppins font-bold text-2xl">
              Trending <span className="text-primary">This Week</span>
            </h2>
            <Link to="/blog">
              <Button variant="link" className="text-primary font-inter">
                See More <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.map((post) => (
              <PostCard key={post.id} {...post} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Mobile */}
      <section className="lg:hidden bg-background py-12">
        <div className="container mx-auto px-4 max-w-md">
          <NewsletterWidget />
        </div>
      </section>

      {/* Categories Quick Access */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-poppins font-bold text-2xl text-center mb-8">
          Explore by <span className="text-primary">Category</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.filter(c => c !== "All").map((cat) => (
            <Link
              key={cat}
              to={`/${cat}`}
              className="px-6 py-3 bg-card border border-border rounded-full font-inter text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
