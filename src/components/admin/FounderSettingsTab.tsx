import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";

interface FounderSettings {
  id: string;
  name: string;
  title: string;
  bio: string;
  image_url: string;
}

export const FounderSettingsTab = () => {
  const [settings, setSettings] = useState<FounderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('founder-settings-admin-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'founder_settings'
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("founder_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default founder settings
        const defaultSettings = {
          name: "Isaac Ashika Amwayi",
          title: "Your Go-To Writer for Impactful Words",
          bio: "Isaac Ashika Amwayi is a passionate and highly skilled writer known for turning ideas into powerful written expressions.",
          image_url: "/src/assets/founder-isaac.jpg"
        };
        
        const { data: newData, error: insertError } = await supabase
          .from("founder_settings")
          .insert([defaultSettings])
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newData);
      }
    } catch (error) {
      console.error("Error fetching founder settings:", error);
      toast.error("Failed to load founder settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("founder_settings")
        .update({
          name: settings.name,
          title: settings.title,
          bio: settings.bio,
          image_url: settings.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Founder settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  if (!settings) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Failed to load founder settings
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Founder/Owner Settings</h2>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="founder_name">Founder Name</Label>
          <Input
            id="founder_name"
            value={settings.name}
            onChange={(e) =>
              setSettings({ ...settings, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="founder_title">Title/Tagline</Label>
          <Input
            id="founder_title"
            value={settings.title}
            onChange={(e) =>
              setSettings({ ...settings, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="founder_bio">Bio</Label>
          <Textarea
            id="founder_bio"
            value={settings.bio}
            onChange={(e) =>
              setSettings({ ...settings, bio: e.target.value })
            }
            rows={8}
          />
        </div>

        <div className="space-y-2">
          <Label>Founder Image</Label>
          <ImageUpload
            onImageUploaded={(url) =>
              setSettings({ ...settings, image_url: url })
            }
            currentImage={settings.image_url}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Founder Settings"}
        </Button>
      </Card>
    </div>
  );
};
