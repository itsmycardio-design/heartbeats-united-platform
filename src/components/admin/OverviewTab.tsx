import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Eye, MessageSquare, Users, TrendingUp, Plus, 
  FolderOpen, Settings, Palette, User, Mail, Bell, 
  BarChart3, Quote, Newspaper, CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  totalMessages: number;
  unreadMessages: number;
  totalSubscribers: number;
  pendingComments: number;
  topPosts: Array<{ title: string; views: number; id: string }>;
  recentPosts: Array<{ title: string; published: boolean; created_at: string; id: string }>;
}

export const OverviewTab = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    viewsToday: 0,
    viewsThisWeek: 0,
    viewsThisMonth: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalSubscribers: 0,
    pendingComments: 0,
    topPosts: [],
    recentPosts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch posts stats
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("id, title, published, created_at")
        .order("created_at", { ascending: false });
      
      const totalPosts = posts?.length || 0;
      const publishedPosts = posts?.filter((p) => p.published).length || 0;
      const draftPosts = totalPosts - publishedPosts;
      const recentPosts = posts?.slice(0, 5) || [];

      // Fetch views stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const { data: allViews } = await supabase.from("page_views").select("*");
      const totalViews = allViews?.length || 0;

      const { data: todayViews } = await supabase
        .from("page_views")
        .select("*")
        .gte("viewed_at", today.toISOString());
      const viewsToday = todayViews?.length || 0;

      const { data: weekViews } = await supabase
        .from("page_views")
        .select("*")
        .gte("viewed_at", weekAgo.toISOString());
      const viewsThisWeek = weekViews?.length || 0;

      const { data: monthViews } = await supabase
        .from("page_views")
        .select("*")
        .gte("viewed_at", monthAgo.toISOString());
      const viewsThisMonth = monthViews?.length || 0;

      // Fetch messages stats
      const { data: messages } = await supabase.from("contact_messages").select("is_read");
      const totalMessages = messages?.length || 0;
      const unreadMessages = messages?.filter((m) => !m.is_read).length || 0;

      // Fetch subscribers
      const { data: subscribers } = await supabase
        .from("subscribers")
        .select("*")
        .eq("is_active", true);
      const totalSubscribers = subscribers?.length || 0;

      // Fetch pending comments
      const { data: comments } = await supabase
        .from("comments")
        .select("is_approved")
        .eq("is_approved", false);
      const pendingComments = comments?.length || 0;

      // Fetch top posts by views
      const { data: topPostsData } = await supabase
        .from("page_views")
        .select("post_id")
        .not("post_id", "is", null);

      const postViewCounts: { [key: string]: number } = {};
      topPostsData?.forEach((view) => {
        if (view.post_id) {
          postViewCounts[view.post_id] = (postViewCounts[view.post_id] || 0) + 1;
        }
      });

      const topPostIds = Object.entries(postViewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      const topPosts = await Promise.all(
        topPostIds.map(async (id) => {
          const { data: post } = await supabase
            .from("blog_posts")
            .select("id, title")
            .eq("id", id)
            .single();
          return {
            id,
            title: post?.title || "Unknown",
            views: postViewCounts[id],
          };
        })
      );

      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
        viewsToday,
        viewsThisWeek,
        viewsThisMonth,
        totalMessages,
        unreadMessages,
        totalSubscribers,
        pendingComments,
        topPosts,
        recentPosts,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-post":
        navigate("/admin?tab=posts");
        setTimeout(() => {
          const newPostBtn = document.querySelector('[data-action="new-post"]') as HTMLButtonElement;
          newPostBtn?.click();
        }, 100);
        break;
      case "new-quote":
        navigate("/admin?tab=posts&type=quote");
        setTimeout(() => {
          const newPostBtn = document.querySelector('[data-action="new-post"]') as HTMLButtonElement;
          newPostBtn?.click();
        }, 100);
        break;
      case "view-posts":
        navigate("/admin?tab=posts");
        break;
      case "view-messages":
        navigate("/admin?tab=messages");
        break;
      case "view-comments":
        navigate("/admin?tab=comments");
        break;
      case "view-subscribers":
        navigate("/admin?tab=subscribers");
        break;
      case "view-analytics":
        navigate("/admin?tab=analytics");
        break;
      case "theme-settings":
        navigate("/admin?tab=theme");
        break;
      case "site-settings":
        navigate("/admin?tab=site");
        break;
      case "founder-settings":
        navigate("/admin?tab=founder");
        break;
      case "manage-writers":
        navigate("/admin?tab=writers");
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">Welcome to Ukweli Media Admin</h2>
        <p className="opacity-90">Manage your content, engage with readers, and grow your platform.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary" onClick={() => handleQuickAction("new-post")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">New Article</p>
              <p className="text-sm text-muted-foreground">Create blog post</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-amber-500" onClick={() => handleQuickAction("new-quote")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-full">
              <Quote className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold">New Quote</p>
              <p className="text-sm text-muted-foreground">Add inspiration</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500" onClick={() => handleQuickAction("view-messages")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full relative">
              <Mail className="w-6 h-6 text-blue-500" />
              {stats.unreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
                  {stats.unreadMessages}
                </Badge>
              )}
            </div>
            <div>
              <p className="font-semibold">Messages</p>
              <p className="text-sm text-muted-foreground">{stats.unreadMessages} unread</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-green-500" onClick={() => handleQuickAction("view-comments")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full relative">
              <MessageSquare className="w-6 h-6 text-green-500" />
              {stats.pendingComments > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-amber-500">
                  {stats.pendingComments}
                </Badge>
              )}
            </div>
            <div>
              <p className="font-semibold">Comments</p>
              <p className="text-sm text-muted-foreground">{stats.pendingComments} pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                {stats.publishedPosts} published
              </span>
              <span className="text-xs flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3" />
                {stats.draftPosts} drafts
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.viewsToday}</span> today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unreadMessages > 0 && (
                <span className="text-amber-600">{stats.unreadMessages} unread</span>
              )}
              {stats.unreadMessages === 0 && "All read"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Views Trend */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.viewsToday}</div>
            <p className="text-xs text-muted-foreground">page views</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.viewsThisWeek}</div>
            <p className="text-xs text-muted-foreground">page views</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.viewsThisMonth}</div>
            <p className="text-xs text-muted-foreground">page views</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Top Performing Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No view data available yet</p>
            ) : (
              <div className="space-y-3">
                {stats.topPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                        #{index + 1}
                      </span>
                      <span className="font-medium line-clamp-1">{post.title}</span>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No posts yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className="flex-1">
                      <span className="font-medium line-clamp-1">{post.title}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Settings Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={() => handleQuickAction("theme-settings")}>
              <Palette className="w-4 h-4 text-pink-500" />
              <div className="text-left">
                <p className="font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Colors & fonts</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={() => handleQuickAction("site-settings")}>
              <Settings className="w-4 h-4 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Site Settings</p>
                <p className="text-xs text-muted-foreground">SEO & meta</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={() => handleQuickAction("founder-settings")}>
              <User className="w-4 h-4 text-green-500" />
              <div className="text-left">
                <p className="font-medium">Founder</p>
                <p className="text-xs text-muted-foreground">Profile info</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={() => handleQuickAction("manage-writers")}>
              <Users className="w-4 h-4 text-purple-500" />
              <div className="text-left">
                <p className="font-medium">Writers</p>
                <p className="text-xs text-muted-foreground">Manage team</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
