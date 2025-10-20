import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/data/posts";
import { PostCard } from "@/components/PostCard";

const BlogPost = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

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

  const relatedPosts = posts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Fitness: "bg-primary/10 text-primary border-primary/20",
      Health: "bg-secondary/10 text-secondary border-secondary/20",
      Politics: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300",
      Lifestyle: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300",
      Inspiration: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
    };
    return colors[cat] || "bg-muted text-muted-foreground";
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
            {post.category}
          </Badge>
        </div>
      </section>

      {/* Article Content */}
      <article className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Meta Information */}
        <div className="flex items-center gap-6 mb-6 font-inter text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
          <span>By {post.author || "ItsMyCardio Team"}</span>
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
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share Article
          </Button>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <p className="font-inter text-lg leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          
          <h2 className="font-poppins font-bold text-3xl mt-12 mb-6">Key Insights</h2>
          <p className="font-inter text-lg leading-relaxed mb-6">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <ul className="font-inter text-lg space-y-3 mb-6">
            <li>Evidence-based approaches to wellness and health</li>
            <li>Practical tips you can implement immediately</li>
            <li>Expert insights from leading professionals</li>
            <li>Community-driven success stories</li>
          </ul>

          <h2 className="font-poppins font-bold text-3xl mt-12 mb-6">Taking Action</h2>
          <p className="font-inter text-lg leading-relaxed mb-6">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>

          <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 bg-muted rounded-r-lg">
            <p className="font-poppins text-xl font-semibold mb-2">
              "Success is the sum of small efforts repeated day in and day out."
            </p>
            <cite className="font-inter text-sm text-muted-foreground">— Robert Collier</cite>
          </blockquote>

          <p className="font-inter text-lg leading-relaxed mb-6">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </div>

        {/* Author Bio */}
        <div className="bg-muted rounded-xl p-8 mb-16">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="font-poppins font-bold text-2xl text-primary">
                {(post.author || "ItsMyCardio Team")[0]}
              </span>
            </div>
            <div>
              <h3 className="font-poppins font-bold text-xl mb-2">
                {post.author || "ItsMyCardio Team"}
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
