import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, MessageSquare, Users, TrendingUp, Plus, Upload, FolderOpen } from "lucide-react";
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
  topPosts: Array<{ title: string; views: number; id: string }>;
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
    topPosts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch posts stats
      const { data: posts } = await supabase.from("blog_posts").select("published");
      const totalPosts = posts?.length || 0;
      const publishedPosts = posts?.filter((p) => p.published).length || 0;
      const draftPosts = totalPosts - publishedPosts;

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
        topPosts,
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
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/admin")} className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
            <Button variant="outline" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Manage Categories
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPosts} published, {stats.draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.viewsToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unreadMessages} unread
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
      </div>

      {/* Views Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Views Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewsToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Views This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewsThisWeek}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Views This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewsThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topPosts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No view data available yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{post.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
