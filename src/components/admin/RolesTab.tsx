import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, UserPlus, Shield, Users, PenTool } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
}

type AppRole = "admin" | "writer" | "user";

export const RolesTab = () => {
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRoles[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("writer");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        console.error("Roles error:", rolesError);
        throw rolesError;
      }

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("email");

      if (profilesError) {
        console.error("Profiles error:", profilesError);
        throw profilesError;
      }

      setAllProfiles(profiles || []);

      // Group roles by user
      const rolesMap = new Map<string, string[]>();
      (roles || []).forEach((r: any) => {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push(r.role);
        rolesMap.set(r.user_id, existing);
      });

      // Combine profiles with roles
      const usersData: UserWithRoles[] = (profiles || []).map((p: any) => ({
        id: p.id,
        email: p.email || "",
        full_name: p.full_name || "",
        created_at: p.created_at,
        roles: rolesMap.get(p.id) || [],
      }));

      setUsersWithRoles(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load users and roles");
    } finally {
      setLoading(false);
    }
  };

  const addRole = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      // Check if user already has this role
      const { data: existing, error: checkError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", selectedUserId)
        .eq("role", selectedRole)
        .maybeSingle();

      if (checkError) {
        console.error("Check error:", checkError);
        throw checkError;
      }

      if (existing) {
        toast.error(`User already has ${selectedRole} role`);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .insert([{ user_id: selectedUserId, role: selectedRole }])
        .select();

      if (error) {
        console.error("Insert error:", error);
        if (error.code === "42501") {
          toast.error("Permission denied. Make sure you're logged in as an admin.");
        } else {
          toast.error(`Failed to add role: ${error.message}`);
        }
        return;
      }

      console.log("Role added:", data);
      await fetchData();
      setShowAddForm(false);
      setSelectedUserId("");
      setSearchEmail("");
      toast.success(`${selectedRole} role added successfully`);
    } catch (error: any) {
      console.error("Error adding role:", error);
      toast.error(`Failed to add role: ${error.message || "Unknown error"}`);
    }
  };

  const removeRole = async (userId: string, role: string) => {
    if (!confirm(`Remove ${role} role from this user?`)) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as "admin" | "writer" | "user");

      if (error) {
        console.error("Delete error:", error);
        if (error.code === "42501") {
          toast.error("Permission denied. Make sure you're logged in as an admin.");
        } else {
          toast.error(`Failed to remove role: ${error.message}`);
        }
        return;
      }

      await fetchData();
      toast.success(`${role} role removed`);
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast.error(`Failed to remove role: ${error.message || "Unknown error"}`);
    }
  };

  const filteredProfiles = allProfiles.filter(
    (profile) =>
      searchEmail === "" ||
      profile.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
      profile.full_name?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3 h-3" />;
      case "writer":
        return <PenTool className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "writer":
        return "default";
      default:
        return "secondary";
    }
  };

  const adminCount = usersWithRoles.filter((u) => u.roles.includes("admin")).length;
  const writerCount = usersWithRoles.filter((u) => u.roles.includes("writer")).length;

  if (loading) {
    return <div className="text-center py-8">Loading users and roles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Roles</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive">{adminCount} Admins</Badge>
          <Badge variant="default">{writerCount} Writers</Badge>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Add Role to User</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Users</Label>
                <Input
                  id="search"
                  placeholder="Search by email or name..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {searchEmail && (
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                {filteredProfiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users found
                  </p>
                ) : (
                  filteredProfiles.slice(0, 10).map((profile) => {
                    const userRoles = usersWithRoles.find((u) => u.id === profile.id)?.roles || [];
                    const alreadyHasRole = (userRoles as string[]).includes(selectedRole);
                    return (
                      <div
                        key={profile.id}
                        className={`p-3 rounded-lg transition-colors ${
                          alreadyHasRole
                            ? "bg-muted/50 cursor-not-allowed opacity-60"
                            : selectedUserId === profile.id
                            ? "bg-primary text-primary-foreground cursor-pointer"
                            : "bg-muted hover:bg-muted/80 cursor-pointer"
                        }`}
                        onClick={() => !alreadyHasRole && setSelectedUserId(profile.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{profile.full_name || "No name"}</p>
                            <p className="text-sm opacity-90">{profile.email}</p>
                          </div>
                          <div className="flex gap-1">
                            {userRoles.map((role) => (
                              <Badge key={role} variant={getRoleBadgeVariant(role) as any} className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {alreadyHasRole && (
                          <p className="text-xs mt-1 text-amber-600">Already has {selectedRole} role</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={addRole} disabled={!selectedUserId}>
                Add {selectedRole} Role
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedUserId("");
                  setSearchEmail("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {usersWithRoles.filter((u) => u.roles.length > 0).length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No roles assigned yet
        </Card>
      ) : (
        <div className="grid gap-4">
          {usersWithRoles
            .filter((user) => user.roles.length > 0)
            .sort((a, b) => {
              const aIsAdmin = a.roles.includes("admin") ? 0 : 1;
              const bIsAdmin = b.roles.includes("admin") ? 0 : 1;
              return aIsAdmin - bIsAdmin;
            })
            .map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{user.full_name || user.email}</span>
                      {user.roles.map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role) as any} className="gap-1">
                          {getRoleIcon(role)}
                          {role}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.created_at && (
                      <div className="text-xs text-muted-foreground">
                        Joined: {format(new Date(user.created_at), "PPP")}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {user.roles.map((role) => (
                      <Button
                        key={role}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeRole(user.id, role)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove {role}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
