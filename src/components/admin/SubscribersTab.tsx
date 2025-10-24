import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

export const SubscribersTab = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetchSubscribers();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('subscribers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscribers'
        },
        () => {
          fetchSubscribers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const addSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email: newEmail }]);

      if (error) throw error;
      setNewEmail("");
      await fetchSubscribers();
      toast.success("Subscriber added");
    } catch (error: any) {
      console.error("Error adding subscriber:", error);
      toast.error(error.message || "Failed to add subscriber");
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    try {
      const { error } = await supabase
        .from("subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchSubscribers();
      toast.success("Subscriber removed");
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to remove subscriber");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("subscribers")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      await fetchSubscribers();
      toast.success(currentStatus ? "Subscriber deactivated" : "Subscriber activated");
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast.error("Failed to update subscriber");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading subscribers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscribers</h2>
        <Badge variant="secondary">
          {subscribers.filter(s => s.is_active).length} Active
        </Badge>
      </div>

      <Card className="p-6">
        <form onSubmit={addSubscriber} className="flex gap-2">
          <Input
            type="email"
            placeholder="Add new subscriber email..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <Button type="submit">
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </Card>

      {subscribers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No subscribers yet
        </Card>
      ) : (
        <div className="grid gap-4">
          {subscribers.map((subscriber) => (
            <Card key={subscriber.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{subscriber.email}</span>
                    <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                      {subscriber.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Subscribed: {format(new Date(subscriber.subscribed_at), "PPP")}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(subscriber.id, subscriber.is_active)}
                  >
                    {subscriber.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteSubscriber(subscriber.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};