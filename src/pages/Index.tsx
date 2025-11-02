import { Activity, Heart, Brain, Users, TrendingUp, Mail } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  usePageView("/");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  
  const { posts: allPosts, loading } = useBlogPosts();
  const featuredPosts = allPosts.filter((post) => post.featured).slice(0, 3);
  const trendingPosts = allPosts.slice(0, 6).filter(post => !post.featured).slice(0, 3);

  const handleExploreStories = () => {
    navigate("/blog");
  };

  const handleJoinMovement = () => {
    const newsletterSection = document.getElementById("newsletter-section");
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setSubscribing(true);

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email }]);

      if (error) throw error;

      toast({
        title: "Successfully subscribed!",
        description: "Welcome to the Heartbeat Weekly!",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-purple-500/5 border-b border-border overflow-hidden min-h-[600px] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in">
              <h1 className="font-poppins font-bold text-5xl lg:text-7xl mb-6 leading-tight">
                Welcome to <span className="text-primary">Ukweli Media Hub</span>
              </h1>
              <p className="font-inter text-lg lg:text-xl mb-8 text-muted-foreground">
                Your trusted source for authentic news, wellness insights, and inspiring stories. We bring you truth, empowerment, and community-driven content across fitness, health, politics, and lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleExploreStories}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-poppins font-semibold text-lg px-8"
                >
                  Explore Stories
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleJoinMovement}
                  className="border-2 font-poppins font-semibold text-lg px-8"
                >
                  Join the Movement
                </Button>
              </div>
            </div>

            {/* Latest Articles Preview */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-poppins font-semibold text-2xl mb-4">Latest Stories</h3>
              <div className="space-y-3">
                {allPosts.slice(0, 3).map((post, index) => (
                  <div 
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.id}`)}
                    className="bg-card border border-border p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer group"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex gap-3">
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-poppins font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-secondary/10 rounded-md">{post.category}</span>
                          <span>{post.read_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-poppins font-bold text-4xl lg:text-5xl mb-4">
            Explore Our <span className="text-primary">Categories</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover content that matters to you across fitness, health, leadership, and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard
            title="Fitness & Wellness"
            description="Workouts, nutrition, and cardio tips for optimal health."
            icon={Activity}
            path="/fitness"
            color="bg-primary"
          />
          <CategoryCard
            title="Health & Education"
            description="Evidence-based health information and awareness."
            icon={Heart}
            path="/health"
            color="bg-secondary"
          />
          <CategoryCard
            title="Politics & Leadership"
            description="Thought leadership and political empowerment."
            icon={Brain}
            path="/politics"
            color="bg-purple-500"
          />
          <CategoryCard
            title="Lifestyle & Inspiration"
            description="Stories that motivate and transform."
            icon={Users}
            path="/lifestyle"
            color="bg-pink-500"
          />
        </div>
      </section>

      {/* Featured Posts */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12 animate-fade-in">
            <div>
              <h2 className="font-poppins font-bold text-4xl lg:text-5xl mb-2">
                Featured <span className="text-primary">Stories</span>
              </h2>
              <p className="font-inter text-lg text-muted-foreground">
                Editor's picks from across all categories
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-primary hidden lg:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-poppins font-bold text-4xl lg:text-5xl mb-4">
            Trending <span className="text-primary">Now</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Most popular stories from our community this week
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section id="newsletter-section" className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto animate-scale-in">
            <Mail className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="font-poppins font-bold text-4xl lg:text-5xl mb-4">
              Join the Heartbeat Weekly
            </h2>
            <p className="font-inter text-lg mb-8">
              Get weekly inspiration, wellness tips, and empowering stories delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribing}
                className="flex-1 border-border h-12 font-inter"
              />
              <Button 
                type="submit"
                disabled={subscribing}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-poppins font-semibold h-12 px-8"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="font-inter text-sm mt-4 text-muted-foreground">
              Join 10,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
