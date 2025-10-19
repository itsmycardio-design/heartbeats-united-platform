import { useState } from "react";
import { Search } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/data/posts";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Fitness", "Health", "Politics", "Lifestyle", "Inspiration"];

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
              National <span className="text-primary">Blog</span>
            </h1>
            <p className="font-inter text-lg text-muted-foreground mb-8">
              Stories, insights, and inspiration across fitness, health, leadership, and lifestyle
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-12 h-12 font-inter"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 lg:px-8 py-8 border-b border-border">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <span className="font-inter font-medium text-sm text-muted-foreground shrink-0">
            Filter by:
          </span>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className={`cursor-pointer shrink-0 font-inter ${
                selectedCategory === cat
                  ? "bg-primary hover:bg-primary/90"
                  : "hover:bg-primary/10 hover:text-primary"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-poppins font-semibold text-2xl">
            {filteredPosts.length} {selectedCategory !== "All" && selectedCategory} Articles
          </h2>
          <select className="px-4 py-2 rounded-lg border border-border bg-background font-inter text-sm">
            <option>Latest First</option>
            <option>Oldest First</option>
            <option>Most Popular</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      {/* Sidebar Section */}
      <aside className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Popular Tags */}
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="font-poppins font-semibold text-xl mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["Cardio", "Nutrition", "Leadership", "Wellness", "Politics", "Motivation", "Self-Care", "Youth"].map(
                  (tag) => (
                    <Badge key={tag} variant="outline" className="font-inter">
                      {tag}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Latest Posts */}
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="font-poppins font-semibold text-xl mb-4">Latest Posts</h3>
              <ul className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <li key={post.id}>
                    <a
                      href={`#${post.id}`}
                      className="font-inter text-sm hover:text-primary transition-colors line-clamp-2"
                    >
                      {post.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20">
              <h3 className="font-poppins font-semibold text-xl mb-2">Never Miss a Story</h3>
              <p className="font-inter text-sm text-muted-foreground mb-4">
                Get the latest stories delivered to your inbox
              </p>
              <Input type="email" placeholder="Your email" className="mb-3" />
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-poppins font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Blog;
