import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";

interface ThemeSettings {
  id: string;
  site_name: string;
  site_logo: string | null;
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

export const ThemeSettingsTab = () => {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('theme-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'theme_settings'
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
        .from("theme_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load theme settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("theme_settings")
        .update({
          site_name: settings.site_name,
          site_logo: settings.site_logo,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          font_family: settings.font_family,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Theme settings saved");
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
        No theme settings found
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Theme Settings</h2>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="site_name">Site Name</Label>
          <Input
            id="site_name"
            value={settings.site_name}
            onChange={(e) =>
              setSettings({ ...settings, site_name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Site Logo</Label>
          <ImageUpload
            onImageUploaded={(url) =>
              setSettings({ ...settings, site_logo: url })
            }
            currentImage={settings.site_logo || undefined}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                type="color"
                value={settings.primary_color}
                onChange={(e) =>
                  setSettings({ ...settings, primary_color: e.target.value })
                }
                className="w-20 h-10"
              />
              <Input
                value={settings.primary_color}
                onChange={(e) =>
                  setSettings({ ...settings, primary_color: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary_color"
                type="color"
                value={settings.secondary_color}
                onChange={(e) =>
                  setSettings({ ...settings, secondary_color: e.target.value })
                }
                className="w-20 h-10"
              />
              <Input
                value={settings.secondary_color}
                onChange={(e) =>
                  setSettings({ ...settings, secondary_color: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font_family">Font Family</Label>
          <Input
            id="font_family"
            value={settings.font_family}
            onChange={(e) =>
              setSettings({ ...settings, font_family: e.target.value })
            }
            placeholder="e.g., Inter, Arial, sans-serif"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Theme Settings"}
        </Button>
      </Card>
    </div>
  );
};