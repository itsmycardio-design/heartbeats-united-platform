import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Eye, TrendingUp, FileText } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  topPosts: Array<{ title: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    todayViews: 0,
    topPosts: [],
    dailyViews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get total views
      const { count: totalViews } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      // Get today's views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayViews } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("viewed_at", today.toISOString());

      // Get top posts
      const { data: postsData } = await supabase
        .from("page_views")
        .select("post_id, blog_posts(title)")
        .not("post_id", "is", null);

      const postCounts = postsData?.reduce((acc: any, view: any) => {
        const title = view.blog_posts?.title || "Unknown";
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {});

      const topPosts = Object.entries(postCounts || {})
        .map(([title, views]) => ({ title, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Get daily views for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        return date;
      }).reverse();

      const dailyViewsPromises = last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const { count } = await supabase
          .from("page_views")
          .select("*", { count: "exact", head: true })
          .gte("viewed_at", date.toISOString())
          .lt("viewed_at", nextDay.toISOString());

        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          views: count || 0,
        };
      });

      const dailyViews = await Promise.all(dailyViewsPromises);

      setAnalytics({
        totalViews: totalViews || 0,
        todayViews: todayViews || 0,
        topPosts,
        dailyViews,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.todayViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topPosts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Views Over Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium truncate">{post.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{post.views}</span>
                </div>
              </div>
            ))}
            {analytics.topPosts.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No post views yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
