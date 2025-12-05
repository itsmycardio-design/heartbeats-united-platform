import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Eye, MessageSquare, Users, TrendingUp, Plus, 
  BarChart3, Quote, Newspaper, CheckCircle, Clock, ChevronRight,
  Mail, Calendar, ArrowUpRight
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
  recentPosts: Array<{ title: string; published: boolean; created_at: string; id: string; category: string }>;
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
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("id, title, published, created_at, category")
        .order("created_at", { ascending: false });
      
      const totalPosts = posts?.length || 0;
      const publishedPosts = posts?.filter((p) => p.published).length || 0;
      const draftPosts = totalPosts - publishedPosts;
      const recentPosts = posts?.slice(0, 5) || [];

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

      const { data: messages } = await supabase.from("contact_messages").select("is_read");
      const totalMessages = messages?.length || 0;
      const unreadMessages = messages?.filter((m) => !m.is_read).length || 0;

      const { data: subscribers } = await supabase
        .from("subscribers")
        .select("*")
        .eq("is_active", true);
      const totalSubscribers = subscribers?.length || 0;

      const { data: comments } = await supabase
        .from("comments")
        .select("is_approved")
        .eq("is_approved", false);
      const pendingComments = comments?.length || 0;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="classic-card p-8 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold mb-2">Welcome to Editorial</h2>
            <p className="text-primary-foreground/80 font-sans">
              Manage your content, engage with readers, and grow your platform.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate("/admin?tab=posts")}
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
                  <CheckCircle className="w-3 h-3" /> {stats.publishedPosts} live
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
              <p className="text-xs text-success mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +{stats.viewsToday} today
              </p>
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

      {/* Views Trend */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="classic-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-info/10 rounded-sm">
                <TrendingUp className="w-4 h-4 text-info" />
              </div>
              <p className="editorial-subheader">Today</p>
            </div>
            <p className="font-serif text-4xl font-semibold text-info">{stats.viewsToday}</p>
            <p className="text-sm text-muted-foreground mt-1">page views</p>
          </CardContent>
        </Card>

        <Card className="classic-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-success/10 rounded-sm">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="editorial-subheader">This Week</p>
            </div>
            <p className="font-serif text-4xl font-semibold text-success">{stats.viewsThisWeek}</p>
            <p className="text-sm text-muted-foreground mt-1">page views</p>
          </CardContent>
        </Card>

        <Card className="classic-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-sm">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <p className="editorial-subheader">This Month</p>
            </div>
            <p className="font-serif text-4xl font-semibold text-accent">{stats.viewsThisMonth}</p>
            <p className="text-sm text-muted-foreground mt-1">page views</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Posts */}
        <Card className="classic-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Top Performing Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.topPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8 font-sans">No view data available yet</p>
            ) : (
              <div className="divide-y divide-border">
                {stats.topPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-serif text-lg font-bold w-6 ${
                        index === 0 ? 'text-accent' : index === 1 ? 'text-muted-foreground' : index === 2 ? 'text-warning' : 'text-muted-foreground/60'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-sans font-medium line-clamp-1">{post.title}</span>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 font-sans">
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
        <Card className="classic-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Recent Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8 font-sans">No posts yet</p>
            ) : (
              <div className="divide-y divide-border">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className="flex-1">
                      <span className="font-sans font-medium line-clamp-1">{post.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={`category-${post.category} text-xs`}>
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {post.published ? (
                      <Badge className="status-published">Published</Badge>
                    ) : (
                      <Badge className="status-draft">Draft</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="classic-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-serif text-xl">Quick Actions</CardTitle>
          <CardDescription className="font-sans">Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "New Article", icon: Newspaper, href: "/admin?tab=posts", color: "accent" },
              { label: "New Quote", icon: Quote, href: "/admin?tab=posts&type=quote", color: "warning" },
              { label: "View Messages", icon: Mail, href: "/admin?tab=messages", badge: stats.unreadMessages, color: "info" },
              { label: "Moderate Comments", icon: MessageSquare, href: "/admin?tab=comments", badge: stats.pendingComments, color: "success" },
            ].map((item, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto p-4 flex items-center gap-3 justify-start hover:bg-muted/50"
                onClick={() => navigate(item.href)}
              >
                <div className={`p-2 rounded-sm bg-${item.color}/10`}>
                  <item.icon className={`w-4 h-4 text-${item.color}`} />
                </div>
                <div className="text-left">
                  <p className="font-sans font-medium">{item.label}</p>
                  {item.badge !== undefined && item.badge > 0 && (
                    <p className="text-xs text-muted-foreground">{item.badge} pending</p>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
