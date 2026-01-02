import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Facebook, MessageCircle, Twitter, Linkedin, Copy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageView } from "@/hooks/usePageView";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { Comments } from "@/components/Comments";
import { NewsCard } from "@/components/news/NewsCard";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

const BlogPost = () => {
  const { id } = useParams();
  const { post, loading } = useBlogPost(id || "");
  const { posts: allPosts } = useBlogPosts();

  usePageView(`/blog/${id}`, id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-bold text-3xl mb-4">Article Not Found</h1>
          <Link to="/blog"><Button>Back to News</Button></Link>
        </div>
      </div>
    );
  }

  const relatedPosts = allPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 4);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(post.title);
    let url = "";
    switch (platform) {
      case "facebook": url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
      case "twitter": url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`; break;
      case "whatsapp": url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`; break;
      case "linkedin": url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`; break;
      case "copy": navigator.clipboard.writeText(shareUrl); toast.success("Link copied!"); return;
    }
    if (url) window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.image}
        type="article"
        author={post.author_name || "Ukweli Media"}
        publishedTime={post.created_at}
        category={post.category}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${post.category}`} className="hover:text-primary capitalize">{post.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-2">
            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
              <span className="font-medium text-foreground">By {post.author_name || "Ukweli Media"}</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.read_time}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Share:</span>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => handleShare("facebook")}><Facebook className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => handleShare("twitter")}><Twitter className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => handleShare("whatsapp")}><MessageCircle className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => handleShare("linkedin")}><Linkedin className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => handleShare("copy")}><Copy className="w-4 h-4" /></Button>
            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <img src={post.image} alt={post.title} className="w-full" loading="lazy" />
            </div>

            {/* EXCERPT BOX - Clearly Separated */}
            <div className="excerpt-box mb-8">
              <p className="text-lg leading-relaxed italic">
                <strong>Summary:</strong> {post.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div className="prose-news" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-border">
              <Link to={`/${post.category}`} className="inline-block bg-primary text-primary-foreground px-3 py-1 text-sm capitalize">
                {post.category}
              </Link>
            </div>

            {/* Comments */}
            <div className="mt-10">
              <Comments postId={post.id} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-muted border border-border p-8 text-center">
              <p className="text-muted-foreground text-xs uppercase">Advertisement</p>
              <div className="h-64 flex items-center justify-center">
                <span className="text-muted-foreground/50 text-sm">300x250</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-muted py-10">
          <div className="container mx-auto px-4">
            <h2 className="bg-primary text-primary-foreground px-3 py-2 text-sm font-bold uppercase inline-block mb-6">
              RELATED ARTICLES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((p) => (
                <NewsCard key={p.id} {...p} variant="medium" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
