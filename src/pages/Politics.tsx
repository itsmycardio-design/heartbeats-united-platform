import { Brain } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { posts } from "@/data/posts";

const Politics = () => {
  const politicsPosts = posts.filter((post) => post.category === "Politics");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="glass dark:glass-dark py-16 lg:py-24 border-b border-white/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl">
                Politics & <span className="text-purple-600 dark:text-purple-400">Leadership</span>
              </h1>
            </div>
            <p className="font-inter text-lg text-muted-foreground mb-6">
              Thought-leadership stories, opinion articles, and interviews highlighting youth and women in leadership.
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-poppins font-semibold">
              Share Your Leadership Story
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <h2 className="font-poppins font-bold text-3xl mb-6">
          Featured <span className="text-purple-600 dark:text-purple-400">Topics</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Women in Leadership", desc: "Breaking barriers in politics and business" },
            { title: "Youth Activism", desc: "The voice of the next generation" },
            { title: "Policy & Reform", desc: "Shaping the future through advocacy" },
          ].map((topic) => (
            <div
              key={topic.title}
              className="p-6 glass-card dark:glass-card-dark rounded-xl hover:shadow-card-hover transition-all"
            >
              <h3 className="font-poppins font-semibold text-xl mb-2">{topic.title}</h3>
              <p className="font-inter text-sm text-muted-foreground">{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <h2 className="font-poppins font-bold text-3xl mb-8">
          Latest <span className="text-purple-600 dark:text-purple-400">Articles</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {politicsPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Politics;
