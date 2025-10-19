import { Activity } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { posts } from "@/data/posts";

const Fitness = () => {
  const fitnessPosts = posts.filter((post) => post.category === "Fitness");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                <Activity className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl">
                Fitness & <span className="text-primary">Wellness</span>
              </h1>
            </div>
            <p className="font-inter text-lg text-muted-foreground">
              Discover evidence-based workouts, nutrition guidance, and cardio tips to optimize your health and performance.
            </p>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-8">
          {["All", "Workouts", "Nutrition", "Mental Wellness", "Cardio"].map((cat) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full font-inter font-medium transition-all ${
                cat === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fitnessPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Fitness;
