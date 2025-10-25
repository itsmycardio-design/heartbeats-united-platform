-- Create site_settings table for general site configuration
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'News Hub',
  site_tagline TEXT DEFAULT 'Your daily source of news',
  site_description TEXT DEFAULT '',
  site_logo TEXT,
  favicon TEXT,
  meta_keywords TEXT,
  meta_description TEXT,
  robots_txt TEXT DEFAULT 'User-agent: *\nAllow: /',
  maintenance_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (site_name, site_tagline, site_description)
VALUES ('News Hub', 'Your daily source of news', 'Stay informed with the latest news in fitness, health, lifestyle, and politics.');

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;