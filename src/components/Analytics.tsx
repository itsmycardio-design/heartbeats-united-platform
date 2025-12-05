import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { Eye, TrendingUp, FileText, Users, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  weeklyGrowth: number;
  topPosts: Array<{ title: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    todayViews: 0,
    weeklyGrowth: 0,
    topPosts: [],
    dailyViews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { count: totalViews } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayViews } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("viewed_at", today.toISOString());

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

      const last14Days = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        return date;
      }).reverse();

      const dailyViewsPromises = last14Days.map(async (date) => {
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

      // Calculate weekly growth
      const thisWeekViews = dailyViews.slice(-7).reduce((sum, d) => sum + d.views, 0);
      const lastWeekViews = dailyViews.slice(0, 7).reduce((sum, d) => sum + d.views, 0);
      const weeklyGrowth = lastWeekViews > 0 
        ? Math.round(((thisWeekViews - lastWeekViews) / lastWeekViews) * 100)
        : 0;

      setAnalytics({
        totalViews: totalViews || 0,
        todayViews: todayViews || 0,
        weeklyGrowth,
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
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-semibold">Analytics Overview</h2>
        <p className="text-muted-foreground font-sans">Track your content performance and audience engagement</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="editorial-subheader mb-1">Total Views</p>
              <p className="font-serif text-3xl font-semibold">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-sm">
              <Eye className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="editorial-subheader mb-1">Today's Views</p>
              <p className="font-serif text-3xl font-semibold">{analytics.todayViews.toLocaleString()}</p>
              <p className="text-xs text-success mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Active today
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-sm">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="editorial-subheader mb-1">Weekly Growth</p>
              <p className="font-serif text-3xl font-semibold">
                {analytics.weeklyGrowth > 0 ? "+" : ""}{analytics.weeklyGrowth}%
              </p>
              <p className={`text-xs mt-2 flex items-center gap-1 ${analytics.weeklyGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
                {analytics.weeklyGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                vs last week
              </p>
            </div>
            <div className="p-3 bg-info/10 rounded-sm">
              <Calendar className="w-6 h-6 text-info" />
            </div>
          </div>
        </div>
      </div>

      {/* Views Chart */}
      <Card className="classic-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-serif text-xl">Views Over Time</CardTitle>
          <CardDescription className="font-sans">Daily page views for the last 14 days</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={analytics.dailyViews}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '4px',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                fill="url(#viewsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Posts */}
      <Card className="classic-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-serif text-xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Top Performing Articles
          </CardTitle>
          <CardDescription className="font-sans">Articles with the most page views</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {analytics.topPosts.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-sans">No post views yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {analytics.topPosts.map((post, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <span className={`font-serif text-lg font-bold w-8 ${
                      index === 0 ? 'text-accent' : index === 1 ? 'text-muted-foreground' : index === 2 ? 'text-warning' : 'text-muted-foreground/60'
                    }`}>
                      #{index + 1}
                    </span>
                    <p className="font-sans font-medium truncate max-w-md">{post.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="font-serif font-semibold">{post.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
