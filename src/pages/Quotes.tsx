import { Quote } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Quotes = () => {
  usePageView("/quotes");
  const { posts, loading } = useBlogPosts("quotes");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading quotes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-emerald-500/10 rounded-2xl">
                <Quote className="w-12 h-12 text-emerald-500" />
              </div>
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl">
                Quotes & <span className="text-emerald-500">Wisdom</span>
              </h1>
            </div>
            <p className="font-inter text-lg text-muted-foreground">
              Words of wisdom to guide your journey. Powerful quotes and timeless wisdom that inspire action and reflection.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No quotes yet. Check back soon for daily inspiration!
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

export default Quotes;
