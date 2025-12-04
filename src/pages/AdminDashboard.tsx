import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, BarChart, Quote, Newspaper, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ImageUpload";
import { MediaUpload } from "@/components/MediaUpload";
import { Analytics } from "@/components/Analytics";
import { MessagesTab } from "@/components/admin/MessagesTab";
import { SubscribersTab } from "@/components/admin/SubscribersTab";
import { RolesTab } from "@/components/admin/RolesTab";
import { CommentsTab } from "@/components/admin/CommentsTab";
import { ThemeSettingsTab } from "@/components/admin/ThemeSettingsTab";
import { FounderSettingsTab } from "@/components/admin/FounderSettingsTab";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { SiteSettingsTab } from "@/components/admin/SiteSettingsTab";

interface MediaFile {
  url: string;
  type: "image" | "video";
  caption?: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  read_time: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  author_id?: string;
  author_name?: string;
  media_files?: MediaFile[];
  video_url?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, isWriter, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [postType, setPostType] = useState<"article" | "quote">("article");
  
  // Get tab from URL params
  const initialTab = searchParams.get('tab') || 'overview';
  const urlPostType = searchParams.get('type');

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "fitness",
    image: "",
    read_time: "5 min read",
    featured: false,
    published: true,
    media_files: [] as MediaFile[],
    video_url: "",
  });

  useEffect(() => {
    if (!authLoading && !isAdmin && !isWriter) {
      navigate("/");
      toast.error("You don't have permission to access this page");
    }
  }, [isAdmin, isWriter, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin || isWriter) {
      fetchPosts();
    }
  }, [isAdmin, isWriter]);

  useEffect(() => {
    if (urlPostType === 'quote') {
      setPostType('quote');
      setFormData(prev => ({ ...prev, category: 'quotes' }));
    }
  }, [urlPostType]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          profiles:author_id (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const postsWithAuthors = (data || []).map((post: any) => ({
        ...post,
        author_name: post.profiles?.full_name || "Unknown Author",
        media_files: (post.media_files as any as MediaFile[]) || [],
        video_url: post.video_url || "",
      }));
      
      setPosts(postsWithAuthors);
    } catch (error: any) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      // For quotes, use title as the quote text, and set defaults for other fields
      const isQuote = formData.category === "quotes";
      const dataToSubmit = {
        ...formData,
        excerpt: isQuote ? formData.title : formData.excerpt, // For quotes, excerpt = title
        content: isQuote ? formData.title : formData.content, // For quotes, content = title
        read_time: isQuote ? "1 min read" : formData.read_time,
        media_files: formData.media_files as any,
      };

      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(dataToSubmit)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success(isQuote ? "Quote updated successfully" : "Post updated successfully");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([{
            ...dataToSubmit,
            author_id: user.id
          }]);

        if (error) throw error;
        toast.success(isQuote ? "Quote created successfully" : "Post created successfully");
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("⚠️ WARNING: This will delete ALL blog posts permanently. Are you absolutely sure?")) return;
    if (!confirm("This action CANNOT be undone. Type 'DELETE' to confirm.")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all posts

      if (error) throw error;
      toast.success("All posts deleted successfully");
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image,
      read_time: post.read_time,
      featured: post.featured,
      published: post.published,
      media_files: post.media_files || [],
      video_url: post.video_url || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingPost(null);
    setPostType("article");
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "fitness",
      image: "",
      read_time: "5 min read",
      featured: false,
      published: false,
      media_files: [],
      video_url: "",
    });
    setShowForm(false);
  };

  const handleNewPost = (type: "article" | "quote") => {
    setPostType(type);
    if (type === "quote") {
      setFormData(prev => ({ ...prev, category: "quotes" }));
    }
    setShowForm(true);
  };

  const isQuoteForm = formData.category === "quotes";

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin && !isWriter) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {isAdmin ? "Admin" : "Writer"} Dashboard
      </h1>

        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="flex-wrap h-auto">
            {isAdmin && <TabsTrigger value="overview">Overview</TabsTrigger>}
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                <TabsTrigger value="roles">User Roles</TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="theme">Theme Settings</TabsTrigger>
                <TabsTrigger value="site">Site Settings</TabsTrigger>
                <TabsTrigger value="founder">Founder Settings</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                {isAdmin && posts.length > 0 && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAll}
                    className="mr-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Posts
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {!showForm && (
                  <>
                    <Button onClick={() => handleNewPost("article")} data-action="new-post">
                      <Newspaper className="w-4 h-4 mr-2" />
                      New Article
                    </Button>
                    <Button variant="outline" onClick={() => handleNewPost("quote")}>
                      <Quote className="w-4 h-4 mr-2" />
                      New Quote
                    </Button>
                  </>
                )}
              </div>
            </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isQuoteForm ? <Quote className="w-5 h-5" /> : <Newspaper className="w-5 h-5" />}
                {editingPost ? (isQuoteForm ? "Edit Quote" : "Edit Post") : (isQuoteForm ? "Create New Quote" : "Create New Post")}
              </CardTitle>
              {isQuoteForm && (
                <CardDescription>
                  Quotes only need the quote text and an optional author image.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{isQuoteForm ? "Quote Text" : "Title"}</Label>
                  <Textarea
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder={isQuoteForm ? "Enter the quote text..." : "Enter the article title..."}
                    rows={isQuoteForm ? 4 : 1}
                    required
                  />
                </div>

                {!isQuoteForm && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={10}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {isQuoteForm ? (
                          <SelectItem value="quotes">Quotes</SelectItem>
                        ) : (
                          <>
                            <SelectItem value="fitness">Fitness & Wellness</SelectItem>
                            <SelectItem value="health">Health & Education</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle & Inspiration</SelectItem>
                            <SelectItem value="politics">Politics & Leadership</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="inspiration">Inspiration</SelectItem>
                            <SelectItem value="quotes">Quotes</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {!isQuoteForm && (
                    <div className="space-y-2">
                      <Label htmlFor="readTime">Read Time</Label>
                      <Input
                        id="readTime"
                        value={formData.read_time}
                        onChange={(e) =>
                          setFormData({ ...formData, read_time: e.target.value })
                        }
                        required
                      />
                    </div>
                  )}
                </div>

                <ImageUpload
                  currentImage={formData.image}
                  onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                />

                {!isQuoteForm && (
                  <MediaUpload
                    currentMedia={formData.media_files}
                    onMediaChange={(media) => setFormData({ ...formData, media_files: media })}
                    maxFiles={10}
                  />
                )}

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, published: checked })
                      }
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingPost ? "Update" : "Create"} Post
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No blog posts yet. Create your first post to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-poppins font-semibold text-xl mb-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-2 py-1 bg-secondary rounded-md">
                          {post.category}
                        </span>
                        <span className="text-muted-foreground">{post.read_time}</span>
                        {post.author_name && (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-md">
                            By {post.author_name}
                          </span>
                        )}
                        {post.featured && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                            Featured
                          </span>
                        )}
                        {post.published ? (
                          <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-md">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-md">
                            Draft
                          </span>
                        )}
                        <span className="text-muted-foreground text-xs ml-auto">
                          Created: {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        title="Edit post"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(post.id)}
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
          </TabsContent>

          {isAdmin && (
            <>
              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="comments">
                <CommentsTab />
              </TabsContent>

              <TabsContent value="messages">
                <MessagesTab />
              </TabsContent>

              <TabsContent value="subscribers">
                <SubscribersTab />
              </TabsContent>

              <TabsContent value="roles">
                <RolesTab />
              </TabsContent>

              <TabsContent value="analytics">
                <Analytics />
              </TabsContent>

              <TabsContent value="theme">
                <ThemeSettingsTab />
              </TabsContent>

              <TabsContent value="site">
                <SiteSettingsTab />
              </TabsContent>

              <TabsContent value="founder">
                <FounderSettingsTab />
              </TabsContent>
            </>
          )}
        </Tabs>
    </div>
  );
};

export default AdminDashboard;
