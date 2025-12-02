import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, RefreshCw, LayoutGrid, List } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/magazine/SidebarWidgets";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { toast } from "@/hooks/use-toast";

const categories = ["All", "fitness", "health", "politics", "lifestyle", "education", "inspiration", "quotes"];

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { posts, loading, refetch } = useBlogPosts();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (posts.length === 0 && !loading) {
      setError(true);
    } else {
      setError(false);
    }
  }, [posts, loading]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  const handleRetry = async () => {
    setError(false);
    toast({
      title: "Retrying...",
      description: "Fetching articles again.",
    });
    try {
      await refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
      setError(true);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-inter">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-muted border-b border-border py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-4">
              Our <span className="text-primary">Blog</span>
            </h1>
            <p className="font-inter text-muted-foreground mb-8">
              Discover stories, insights, and inspiration across health, fitness, politics, and lifestyle.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-12 h-12 font-inter bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="border-b border-border bg-card sticky top-[125px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer shrink-0 font-inter text-xs px-4 py-1.5 transition-all ${
                  selectedCategory === cat
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "All" ? "All Posts" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-poppins font-semibold text-xl">
                  {filteredPosts.length} {selectedCategory !== "All" ? selectedCategory : ""} Articles
                </h2>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Results for "{searchQuery}"
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="w-9 h-9"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="w-9 h-9"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Posts Grid/List */}
            {error && filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-muted rounded-lg">
                <p className="text-muted-foreground text-lg mb-4">
                  Failed to load articles. Please check your connection.
                </p>
                <Button onClick={handleRetry} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-muted rounded-lg">
                <p className="text-muted-foreground text-lg">No articles found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} {...post} variant="default" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} {...post} variant="horizontal" />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-40">
              <Sidebar
                posts={posts}
                categories={categories}
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
