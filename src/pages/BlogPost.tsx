import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, MessageCircle, Twitter, Linkedin, Copy, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/PostCard";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { Comments } from "@/components/Comments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const BlogPost = () => {
  const { id } = useParams();
  const { post, loading } = useBlogPost(id || "");
  const { posts: allPosts } = useBlogPosts();

  usePageView(`/blog/${id}`, id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-inter">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-poppins font-bold text-4xl mb-4">Article Not Found</h1>
          <p className="font-inter text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryClass = (cat: string) => {
    const categoryMap: Record<string, string> = {
      fitness: "category-fitness",
      health: "category-health",
      politics: "category-politics",
      lifestyle: "category-lifestyle",
      education: "category-education",
      inspiration: "category-inspiration",
      quotes: "category-quotes",
    };
    return categoryMap[cat.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <section className="container mx-auto px-4 mb-8">
        <div className="relative h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>
      </section>

      {/* Article Content */}
      <article className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge className={`${getCategoryClass(post.category)} font-inter text-xs font-medium`}>
              <Tag className="w-3 h-3 mr-1" />
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-inter">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.read_time}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="font-inter text-xl text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary pl-6">
            {post.excerpt}
          </p>

          {/* Author & Share Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-border mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-poppins font-semibold text-sm">
                  {post.author_name || "Ukweli Media Team"}
                </p>
                <p className="text-xs text-muted-foreground">Contributing Writer</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Share:</span>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => handleShare("whatsapp")}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => handleShare("copy")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose-magazine mb-16">
            <div
              className="font-inter"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Author Bio */}
          <div className="bg-muted rounded-xl p-6 md:p-8 mb-12">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="font-poppins font-bold text-2xl text-primary">
                  {post.author_name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-poppins font-bold text-xl mb-2">
                  About {post.author_name || "Ukweli Media Team"}
                </h3>
                <p className="font-inter text-muted-foreground mb-4 leading-relaxed">
                  A passionate contributor dedicated to sharing authentic stories, wellness insights, and thought leadership. Committed to empowering readers with truth and inspiration.
                </p>
                <Link to="/about">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-16">
            <Comments postId={post.id} />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-muted py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-8">
              Related <span className="text-primary">Articles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} {...relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
