import { Heart } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { posts } from "@/data/posts";

const Health = () => {
  const healthPosts = posts.filter((post) => post.category === "Health");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-muted py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                <Heart className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl">
                Health & <span className="text-secondary">Education</span>
              </h1>
            </div>
            <p className="font-inter text-lg text-muted-foreground mb-6">
              Focused on health education, cardio awareness, and wellness facts that empower you to make informed decisions.
            </p>
            <Button className="bg-gradient-to-r from-secondary to-secondary-light hover:opacity-90 font-poppins font-semibold">
              Partner with Us in Promoting Health Awareness
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Articles Published", value: "150+" },
            { label: "Readers Monthly", value: "50K+" },
            { label: "Expert Contributors", value: "25+" },
            { label: "Topics Covered", value: "100+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="font-poppins font-bold text-4xl text-secondary mb-2">
                {stat.value}
              </div>
              <div className="font-inter text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <h2 className="font-poppins font-bold text-3xl mb-8">
          Latest Health <span className="text-secondary">Articles</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {healthPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Health;
