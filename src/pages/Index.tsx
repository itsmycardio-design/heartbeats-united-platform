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
      {/* Hero Section */}
      <section className="relative bg-muted border-b border-border overflow-hidden">
        <div className="relative container mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="font-poppins font-bold text-5xl lg:text-7xl mb-6 leading-tight">
              Empowering Hearts,
              <br />
              <span className="text-primary">Transforming Lives</span>
            </h1>
            <p className="font-inter text-lg lg:text-xl mb-8">
              Your national platform for fitness, wellness, leadership, and stories that inspire. Join thousands on a journey to better health and empowerment.
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
