import { BookOpen } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Education = () => {
  usePageView("/education");
  const { posts, loading } = useBlogPosts("education");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading education articles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-blue-500/10 rounded-2xl">
                <BookOpen className="w-12 h-12 text-blue-500" />
              </div>
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl">
                Education & <span className="text-blue-500">Learning</span>
              </h1>
            </div>
            <p className="font-inter text-lg text-muted-foreground">
              Knowledge is power. Explore educational content, learning resources, and insights that help you grow and make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No education articles yet. Check back soon!
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

export default Education;
