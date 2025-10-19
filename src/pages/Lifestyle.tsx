import { Users } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { posts } from "@/data/posts";

const Lifestyle = () => {
  const lifestylePosts = posts.filter((post) => 
    post.category === "Lifestyle" || post.category === "Inspiration"
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/20 dark:to-pink-900/5 py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-pink-500 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl">
                Lifestyle & <span className="text-pink-600 dark:text-pink-400">Inspiration</span>
              </h1>
            </div>
            <p className="font-inter text-lg text-muted-foreground">
              Personal motivation, culture, and lifestyle stories that inspire positive change and personal growth.
            </p>
          </div>
        </div>
      </section>

      {/* Inspiration Quote */}
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-pink-500/10 to-pink-400/5 rounded-2xl p-8 lg:p-12 text-center">
          <blockquote className="font-poppins text-2xl lg:text-3xl font-semibold mb-4">
            "The only way to do great work is to love what you do."
          </blockquote>
          <cite className="font-inter text-muted-foreground">— Steve Jobs</cite>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <h2 className="font-poppins font-bold text-3xl mb-8">
          Stories That <span className="text-pink-600 dark:text-pink-400">Inspire</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lifestylePosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Lifestyle;
