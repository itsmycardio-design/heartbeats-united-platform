import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  blog_posts?: {
    title: string;
  };
}

export const CommentsTab = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    fetchComments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("comments-admin")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const fetchComments = async () => {
    try {
      let query = supabase
        .from("comments")
        .select(`
          *,
          blog_posts (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (filter === "pending") {
        query = query.eq("is_approved", false);
      } else if (filter === "approved") {
        query = query.eq("is_approved", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .update({ is_approved: true })
        .eq("id", id);

      if (error) throw error;
      toast.success("Comment approved");
    } catch (error) {
      console.error("Error approving comment:", error);
      toast.error("Failed to approve comment");
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  const pendingCount = comments.filter((c) => !c.is_approved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className="gap-2"
          >
            Pending
            {pendingCount > 0 && (
              <Badge variant="secondary">{pendingCount}</Badge>
            )}
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
        </div>
      </div>

      {comments.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No {filter === "pending" ? "pending" : filter === "approved" ? "approved" : ""} comments
        </Card>
      ) : (
        <div className="grid gap-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author_name}</span>
                      <Badge variant={comment.is_approved ? "default" : "secondary"}>
                        {comment.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {comment.author_email}
                    </div>
                    {comment.blog_posts && (
                      <div className="text-sm text-muted-foreground mb-2">
                        On: <span className="font-medium">{comment.blog_posts.title}</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "PPP 'at' p")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!comment.is_approved && (
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => approveComment(comment.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
