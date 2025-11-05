import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Writer {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
}

export const WritersTab = () => {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    fetchWriters();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("email");

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addWriter = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    try {
      // Check if user already has writer role
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", selectedUserId)
        .eq("role", "writer")
        .single();

      if (existing) {
        toast.error("User already has writer role");
        return;
      }

      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: selectedUserId, role: "writer" }]);

      if (error) throw error;
      
      await fetchWriters();
      setShowAddForm(false);
      setSelectedUserId("");
      setSearchEmail("");
      toast.success("Writer role added successfully");
    } catch (error: any) {
      console.error("Error adding writer:", error);
      toast.error("Failed to add writer role");
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

  const filteredUsers = users.filter(user => 
    !writers.some(w => w.id === user.id) &&
    (searchEmail === "" || user.email.toLowerCase().includes(searchEmail.toLowerCase()) || 
     user.full_name?.toLowerCase().includes(searchEmail.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-8">Loading writers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Writers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users who can create and publish blog posts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{writers.length} Writers</Badge>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Writer
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Add Writer Role</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Users</Label>
              <Input
                id="search"
                placeholder="Search by email or name..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            
            {searchEmail && (
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users found
                  </p>
                ) : (
                  filteredUsers.slice(0, 10).map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUserId === user.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <p className="font-medium">{user.full_name || "No name"}</p>
                      <p className="text-sm opacity-90">{user.email}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={addWriter} disabled={!selectedUserId}>
                Add Writer Role
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddForm(false);
                setSelectedUserId("");
                setSearchEmail("");
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

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