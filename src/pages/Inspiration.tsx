import { Sparkles } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Inspiration = () => {
  usePageView("/inspiration");
  const { posts, loading } = useBlogPosts("inspiration");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading inspirational stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-amber-500/10 rounded-2xl">
                <Sparkles className="w-12 h-12 text-amber-500" />
              </div>
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl">
                Inspiration & <span className="text-amber-500">Motivation</span>
              </h1>
            </div>
            <p className="font-inter text-lg text-muted-foreground">
              Stories that uplift, motivate, and inspire. Discover content that fuels your passion and empowers you to chase your dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No inspirational stories yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Inspiration;
