import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, BarChart } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { Analytics } from "@/components/Analytics";
import { MessagesTab } from "@/components/admin/MessagesTab";
import { SubscribersTab } from "@/components/admin/SubscribersTab";
import { WritersTab } from "@/components/admin/WritersTab";
import { ThemeSettingsTab } from "@/components/admin/ThemeSettingsTab";
import { FounderSettingsTab } from "@/components/admin/FounderSettingsTab";

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
}

const AdminDashboard = () => {
  const { user, isAdmin, isWriter, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "fitness",
    image: "",
    read_time: "5 min read",
    featured: false,
    published: false,
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

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
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

      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(formData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([{
            ...formData,
            author_id: user.id
          }]);

        if (error) throw error;
        toast.success("Post created successfully");
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
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "fitness",
      image: "",
      read_time: "5 min read",
      featured: false,
      published: false,
    });
    setShowForm(false);
  };

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

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                <TabsTrigger value="writers">Writers</TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="settings">Theme Settings</TabsTrigger>
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
              <div>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                )}
              </div>
            </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingPost ? "Edit Post" : "Create New Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

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
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="politics">Politics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                </div>

                <ImageUpload
                  currentImage={formData.image}
                  onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                />

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
              <TabsContent value="messages">
                <MessagesTab />
              </TabsContent>

              <TabsContent value="subscribers">
                <SubscribersTab />
              </TabsContent>

              <TabsContent value="writers">
                <WritersTab />
              </TabsContent>

              <TabsContent value="analytics">
                <Analytics />
              </TabsContent>

              <TabsContent value="settings">
                <ThemeSettingsTab />
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
