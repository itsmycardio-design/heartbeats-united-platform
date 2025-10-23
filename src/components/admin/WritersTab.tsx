import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Writer {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string;
}

export const WritersTab = () => {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWriters();
  }, []);

  const fetchWriters = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          profiles (
            id,
            email,
            full_name,
            created_at
          )
        `)
        .eq("role", "writer");

      if (error) throw error;

      const writersData = (data || []).map((item: any) => ({
        id: item.profiles.id,
        email: item.profiles.email,
        full_name: item.profiles.full_name,
        created_at: item.profiles.created_at,
        role: item.role,
      }));

      setWriters(writersData);
    } catch (error) {
      console.error("Error fetching writers:", error);
      toast.error("Failed to load writers");
    } finally {
      setLoading(false);
    }
  };

  const removeWriter = async (userId: string) => {
    if (!confirm("Remove writer role from this user?")) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "writer");

      if (error) throw error;
      await fetchWriters();
      toast.success("Writer role removed");
    } catch (error) {
      console.error("Error removing writer:", error);
      toast.error("Failed to remove writer role");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading writers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Writers</h2>
        <Badge variant="secondary">{writers.length} Writers</Badge>
      </div>

      <Card className="p-6 bg-muted/50">
        <div className="flex items-start gap-3">
          <UserCog className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Manage Writer Roles</p>
            <p className="text-sm text-muted-foreground">
              To add a writer role, go to your backend and manually assign the 'writer' role to a user in the user_roles table.
            </p>
          </div>
        </div>
      </Card>

      {writers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No writers assigned yet
        </Card>
      ) : (
        <div className="grid gap-4">
          {writers.map((writer) => (
            <Card key={writer.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{writer.full_name || writer.email}</span>
                    <Badge variant="default">Writer</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {writer.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined: {format(new Date(writer.created_at), "PPP")}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeWriter(writer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};