import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { Globe, Lock, FileText, Image } from "lucide-react";

interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string;
  site_description: string;
  site_logo: string | null;
  favicon: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  robots_txt: string | null;
  maintenance_mode: boolean;
}

export const SiteSettingsTab = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel("site-settings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
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
        .from("site_settings")
        .select("*")
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          site_name: settings.site_name,
          site_tagline: settings.site_tagline,
          site_description: settings.site_description,
          site_logo: settings.site_logo,
          favicon: settings.favicon,
          meta_keywords: settings.meta_keywords,
          meta_description: settings.meta_description,
          robots_txt: settings.robots_txt,
          maintenance_mode: settings.maintenance_mode,
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">No settings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="site_tagline">Site Tagline</Label>
            <Input
              id="site_tagline"
              value={settings.site_tagline || ""}
              onChange={(e) =>
                setSettings({ ...settings, site_tagline: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea
              id="site_description"
              value={settings.site_description || ""}
              onChange={(e) =>
                setSettings({ ...settings, site_description: e.target.value })
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Site Logo</Label>
            <ImageUpload
              currentImage={settings.site_logo || ""}
              onImageUploaded={(url) =>
                setSettings({ ...settings, site_logo: url })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Favicon</Label>
            <ImageUpload
              currentImage={settings.favicon || ""}
              onImageUploaded={(url) =>
                setSettings({ ...settings, favicon: url })
              }
            />
            <p className="text-xs text-muted-foreground">
              Recommended size: 32x32 pixels
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input
              id="meta_keywords"
              value={settings.meta_keywords || ""}
              onChange={(e) =>
                setSettings({ ...settings, meta_keywords: e.target.value })
              }
              placeholder="news, blog, fitness, health"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords for search engines
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={settings.meta_description || ""}
              onChange={(e) =>
                setSettings({ ...settings, meta_description: e.target.value })
              }
              rows={3}
              placeholder="A brief description of your site for search engines"
            />
            <p className="text-xs text-muted-foreground">
              Max 160 characters recommended
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="robots_txt">Robots.txt</Label>
            <Textarea
              id="robots_txt"
              value={settings.robots_txt || ""}
              onChange={(e) =>
                setSettings({ ...settings, robots_txt: e.target.value })
              }
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Control how search engines crawl your site
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security & Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security & Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable the site for maintenance
              </p>
            </div>
            <Switch
              id="maintenance_mode"
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenance_mode: checked })
              }
            />
          </div>

          {settings.maintenance_mode && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                ⚠️ Your site is currently in maintenance mode. Visitors will see a maintenance page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};
