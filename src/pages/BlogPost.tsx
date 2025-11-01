import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, MessageCircle, Twitter, Linkedin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/PostCard";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
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
  
  // Track page view
  usePageView(`/blog/${id}`, id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-poppins font-bold text-4xl mb-4">Post Not Found</h1>
          <p className="font-inter text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist.
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (cat: string) => {
    const categoryMap: Record<string, string> = {
      fitness: "bg-primary/10 text-primary border-primary/20",
      health: "bg-secondary/10 text-secondary border-secondary/20",
      politics: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300",
      lifestyle: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300",
    };
    return categoryMap[cat.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';
  const shareText = post?.excerpt || '';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedText = encodeURIComponent(shareText);

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Link to="/blog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <section className="container mx-auto px-4 lg:px-8 mb-12">
        <div className="relative h-96 rounded-2xl overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <Badge
            className={`absolute bottom-6 left-6 ${getCategoryColor(post.category)} font-poppins font-medium`}
          >
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Badge>
        </div>
      </section>

      {/* Article Content */}
      <article className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Meta Information */}
        <div className="flex items-center gap-6 mb-6 font-inter text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.read_time}</span>
          </div>
          <span>By ItsMyCardio Team</span>
        </div>

        {/* Title */}
        <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="font-inter text-xl text-muted-foreground mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Share Button */}
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Article
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => handleShare('facebook')} className="gap-2 cursor-pointer">
                <Facebook className="w-4 h-4" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2 cursor-pointer">
                <Twitter className="w-4 h-4" />
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="gap-2 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('linkedin')} className="gap-2 cursor-pointer">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('copy')} className="gap-2 cursor-pointer">
                <Copy className="w-4 h-4" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <div 
            className="font-inter text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author Bio */}
        <div className="bg-muted rounded-xl p-8 mb-16">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="font-poppins font-bold text-2xl text-primary">
                IC
              </span>
            </div>
            <div>
              <h3 className="font-poppins font-bold text-xl mb-2">
                ItsMyCardio Team
              </h3>
              <p className="font-inter text-muted-foreground mb-4">
                Contributing author passionate about wellness, empowerment, and creating positive change in communities across the nation.
              </p>
              <Link to="/about">
                <Button variant="outline" size="sm">View Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-muted py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-poppins font-bold text-3xl mb-8">
              Related <span className="text-primary">Articles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
