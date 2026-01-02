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
import { toast } from "sonner";
import { 
  Pencil, Trash2, Plus, BarChart, Quote, Newspaper, Eye, 
  LayoutDashboard, FileText, MessageSquare, Users, Settings, 
  Palette, User, Mail, TrendingUp, Clock, CheckCircle, 
  ChevronRight, Search, Filter, MoreHorizontal, Calendar,
  Bell, Moon, Sun, Menu, X, LogOut, Home
} from "lucide-react";
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
import { SiteSettingsTab } from "@/components/admin/SiteSettingsTab";
import { WritersTab } from "@/components/admin/WritersTab";
import { cn } from "@/lib/utils";

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

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  viewsToday: number;
  unreadMessages: number;
  totalSubscribers: number;
  pendingComments: number;
}

const AdminDashboard = () => {
  const { user, isAdmin, isWriter, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [postType, setPostType] = useState<"article" | "quote">("article");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalViews: 0,
    viewsToday: 0, unreadMessages: 0, totalSubscribers: 0, pendingComments: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const activeTab = searchParams.get('tab') || 'overview';
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

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    // Auto-collapse sidebar on mobile when selecting a menu item
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAdmin && !isWriter) {
      navigate("/");
      toast.error("You don't have permission to access this page");
    }
  }, [isAdmin, isWriter, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin || isWriter) {
      fetchPosts();
      fetchStats();
    }
  }, [isAdmin, isWriter]);

  useEffect(() => {
    if (urlPostType === 'quote') {
      setPostType('quote');
      setFormData(prev => ({ ...prev, category: 'quotes' }));
    }
  }, [urlPostType]);

  const fetchStats = async () => {
    try {
      const [postsRes, viewsRes, messagesRes, subscribersRes, commentsRes] = await Promise.all([
        supabase.from("blog_posts").select("id, published"),
        supabase.from("page_views").select("id, viewed_at"),
        supabase.from("contact_messages").select("is_read"),
        supabase.from("subscribers").select("id").eq("is_active", true),
        supabase.from("comments").select("id").eq("is_approved", false),
      ]);

      const posts = postsRes.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayViews = (viewsRes.data || []).filter(
        v => new Date(v.viewed_at) >= today
      ).length;

      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.published).length,
        draftPosts: posts.filter(p => !p.published).length,
        totalViews: viewsRes.data?.length || 0,
        viewsToday: todayViews,
        unreadMessages: (messagesRes.data || []).filter(m => !m.is_read).length,
        totalSubscribers: subscribersRes.data?.length || 0,
        pendingComments: commentsRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`*, profiles:author_id (full_name)`)
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

      const isQuote = formData.category === "quotes";
      const dataToSubmit = {
        ...formData,
        excerpt: isQuote ? formData.title : formData.excerpt,
        content: isQuote ? formData.title : formData.content,
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
          .insert([{ ...dataToSubmit, author_id: user.id }]);
        if (error) throw error;
        toast.success(isQuote ? "Quote created successfully" : "Post created successfully");
      }

      resetForm();
      fetchPosts();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Post deleted successfully");
      fetchPosts();
      fetchStats();
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
      title: "", excerpt: "", content: "", category: "fitness",
      image: "", read_time: "5 min read", featured: false,
      published: false, media_files: [], video_url: "",
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "published" && post.published) ||
      (statusFilter === "draft" && !post.published) ||
      (statusFilter === "featured" && post.featured);
    return matchesSearch && matchesStatus;
  });

  const isQuoteForm = formData.category === "quotes";

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !isWriter) return null;

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, adminOnly: true },
    { id: "posts", label: "Posts", icon: FileText, adminOnly: false },
    { id: "comments", label: "Comments", icon: MessageSquare, adminOnly: true, badge: stats.pendingComments },
    { id: "messages", label: "Messages", icon: Mail, adminOnly: true, badge: stats.unreadMessages },
    { id: "subscribers", label: "Subscribers", icon: Users, adminOnly: true },
    { id: "writers", label: "Writers", icon: User, adminOnly: true },
    { id: "roles", label: "User Roles", icon: Users, adminOnly: true },
    { id: "analytics", label: "Analytics", icon: BarChart, adminOnly: true },
    { id: "theme", label: "Theme", icon: Palette, adminOnly: true },
    { id: "site", label: "Site Settings", icon: Settings, adminOnly: true },
    { id: "founder", label: "Founder", icon: User, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "dashboard-sidebar fixed left-0 top-0 h-full z-40 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-sidebar-primary flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-serif text-lg font-semibold text-sidebar-foreground">Editorial</h1>
                  <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="px-3 space-y-1">
              {sidebarItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "sidebar-nav-item w-full text-left",
                      isActive && "active"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 font-sans text-sm">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-xs px-1.5 py-0.5">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => navigate("/")}
            >
              <Home className="w-5 h-5 mr-3" />
              {sidebarOpen && <span className="font-sans text-sm">View Site</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:flex"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground capitalize">
                  {activeTab === "overview" ? "Dashboard" : activeTab.replace("-", " ")}
                </h1>
                <p className="text-sm text-muted-foreground font-sans">
                  {isAdmin ? "Administrator" : "Writer"} · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {(stats.unreadMessages + stats.pendingComments) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {stats.unreadMessages + stats.pendingComments}
                  </span>
                )}
              </Button>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && isAdmin && (
            <div className="space-y-6 animate-fade-in">
              {/* Welcome Banner */}
              <div className="classic-card p-8 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-semibold mb-2">Welcome back</h2>
                    <p className="text-primary-foreground/80 font-sans">
                      Manage your editorial content, engage with readers, and grow your platform.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <Button 
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => { setActiveTab("posts"); handleNewPost("article"); }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Article
                    </Button>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="kpi-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="editorial-subheader mb-1">Total Posts</p>
                      <p className="font-serif text-3xl font-semibold">{stats.totalPosts}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs text-success flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {stats.publishedPosts} published
                        </span>
                        <span className="text-xs text-warning flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {stats.draftPosts} drafts
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-sm">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="editorial-subheader mb-1">Total Views</p>
                      <p className="font-serif text-3xl font-semibold">{stats.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-success mt-2">+{stats.viewsToday} today</p>
                    </div>
                    <div className="p-3 bg-info/10 rounded-sm">
                      <Eye className="w-6 h-6 text-info" />
                    </div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="editorial-subheader mb-1">Subscribers</p>
                      <p className="font-serif text-3xl font-semibold">{stats.totalSubscribers}</p>
                      <p className="text-xs text-muted-foreground mt-2">Active readers</p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-sm">
                      <Users className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="editorial-subheader mb-1">Messages</p>
                      <p className="font-serif text-3xl font-semibold">{stats.unreadMessages}</p>
                      <p className="text-xs text-muted-foreground mt-2">Awaiting response</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-sm">
                      <Mail className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "New Article", icon: Newspaper, action: () => { setActiveTab("posts"); handleNewPost("article"); }, color: "accent" },
                  { label: "New Quote", icon: Quote, action: () => { setActiveTab("posts"); handleNewPost("quote"); }, color: "warning" },
                  { label: "View Messages", icon: Mail, action: () => setActiveTab("messages"), color: "info", badge: stats.unreadMessages },
                  { label: "Moderate Comments", icon: MessageSquare, action: () => setActiveTab("comments"), color: "success", badge: stats.pendingComments },
                ].map((item, idx) => (
                  <Card 
                    key={idx}
                    className="classic-card-hover cursor-pointer border-l-4"
                    style={{ borderLeftColor: `hsl(var(--${item.color}))` }}
                    onClick={item.action}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-3 rounded-sm bg-${item.color}/10`}>
                        <item.icon className={`w-5 h-5 text-${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-sans font-medium">{item.label}</p>
                        {item.badge !== undefined && item.badge > 0 && (
                          <p className="text-xs text-muted-foreground">{item.badge} pending</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Posts */}
              <Card className="classic-card">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-xl">Recent Articles</CardTitle>
                      <CardDescription className="font-sans">Your latest published content</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setActiveTab("posts")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="classic-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.slice(0, 5).map((post) => (
                        <tr key={post.id}>
                          <td>
                            <div className="max-w-xs">
                              <p className="font-medium truncate">{post.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{post.excerpt}</p>
                            </div>
                          </td>
                          <td>
                            <Badge variant="secondary" className={`category-${post.category}`}>
                              {post.category}
                            </Badge>
                          </td>
                          <td>
                            {post.published ? (
                              <Badge className="status-published">Published</Badge>
                            ) : (
                              <Badge className="status-draft">Draft</Badge>
                            )}
                          </td>
                          <td className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {posts.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                      No posts yet. Create your first article to get started.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="space-y-6 animate-fade-in">
              {/* Posts Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="classic-input pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 classic-input">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Drafts</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!showForm && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleNewPost("article")} className="btn-classic-primary">
                      <Newspaper className="w-4 h-4 mr-2" />
                      New Article
                    </Button>
                    <Button variant="outline" onClick={() => handleNewPost("quote")}>
                      <Quote className="w-4 h-4 mr-2" />
                      New Quote
                    </Button>
                  </div>
                )}
              </div>

              {/* Post Form */}
              {showForm && (
                <Card className="classic-card">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="font-serif text-xl flex items-center gap-2">
                      {isQuoteForm ? <Quote className="w-5 h-5 text-accent" /> : <Newspaper className="w-5 h-5 text-accent" />}
                      {editingPost ? (isQuoteForm ? "Edit Quote" : "Edit Article") : (isQuoteForm ? "Create New Quote" : "Create New Article")}
                    </CardTitle>
                    {isQuoteForm && (
                      <CardDescription className="font-sans">
                        Quotes only need the quote text and an optional author image.
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="classic-label">{isQuoteForm ? "Quote Text" : "Title"}</Label>
                        <Textarea
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder={isQuoteForm ? "Enter the quote text..." : "Enter the article title..."}
                          rows={isQuoteForm ? 4 : 2}
                          className="classic-input"
                          required
                        />
                      </div>

                      {!isQuoteForm && (
                        <>
                          <div className="space-y-2">
                            <Label className="classic-label">Excerpt</Label>
                            <Textarea
                              value={formData.excerpt}
                              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                              className="classic-input"
                              rows={3}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="classic-label">Content</Label>
                            <Textarea
                              value={formData.content}
                              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                              className="classic-input font-sans"
                              rows={12}
                              required
                            />
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="classic-label">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger className="classic-input">
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
                            <Label className="classic-label">Read Time</Label>
                            <Input
                              value={formData.read_time}
                              onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                              className="classic-input"
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

                      <div className="flex items-center gap-8 py-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <Switch
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                          />
                          <Label htmlFor="featured" className="font-sans">Featured</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                          />
                          <Label htmlFor="published" className="font-sans">Published</Label>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" className="btn-classic-primary">
                          {editingPost ? "Update" : "Publish"} {isQuoteForm ? "Quote" : "Article"}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Posts Table */}
              <Card className="classic-card">
                <CardContent className="p-0">
                  <table className="classic-table">
                    <thead>
                      <tr>
                        <th>Article</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post) => (
                        <tr key={post.id}>
                          <td>
                            <div className="flex items-center gap-4">
                              {post.image && (
                                <img 
                                  src={post.image} 
                                  alt="" 
                                  className="w-16 h-12 object-cover rounded-sm"
                                />
                              )}
                              <div className="max-w-sm">
                                <p className="font-medium line-clamp-1">{post.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-sm">{post.author_name}</td>
                          <td>
                            <Badge variant="secondary" className={`category-${post.category}`}>
                              {post.category}
                            </Badge>
                          </td>
                          <td>
                            <div className="flex flex-col gap-1">
                              {post.published ? (
                                <Badge className="status-published w-fit">Published</Badge>
                              ) : (
                                <Badge className="status-draft w-fit">Draft</Badge>
                              )}
                              {post.featured && (
                                <Badge variant="outline" className="w-fit text-xs">Featured</Badge>
                              )}
                            </div>
                          </td>
                          <td className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} title="Edit">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => navigate(`/blog/${post.id}`)} title="View">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} title="Delete" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPosts.length === 0 && (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground font-sans">
                        {searchQuery || statusFilter !== "all" 
                          ? "No posts match your filters." 
                          : "No posts yet. Create your first article to get started!"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other Tabs */}
          {activeTab === "comments" && isAdmin && <CommentsTab />}
          {activeTab === "messages" && isAdmin && <MessagesTab />}
          {activeTab === "subscribers" && isAdmin && <SubscribersTab />}
          {activeTab === "writers" && isAdmin && <WritersTab />}
          {activeTab === "roles" && isAdmin && <RolesTab />}
          {activeTab === "analytics" && isAdmin && <Analytics />}
          {activeTab === "theme" && isAdmin && <ThemeSettingsTab />}
          {activeTab === "site" && isAdmin && <SiteSettingsTab />}
          {activeTab === "founder" && isAdmin && <FounderSettingsTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
