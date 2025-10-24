-- Create founder_settings table
CREATE TABLE IF NOT EXISTS public.founder_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Isaac Ashika Amwayi',
  title TEXT NOT NULL DEFAULT 'Your Go-To Writer for Impactful Words',
  bio TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.founder_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view founder settings
CREATE POLICY "Anyone can view founder settings"
  ON public.founder_settings
  FOR SELECT
  USING (true);

-- Admins can manage founder settings
CREATE POLICY "Admins can manage founder settings"
  ON public.founder_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_founder_settings_updated_at
  BEFORE UPDATE ON public.founder_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default founder settings
INSERT INTO public.founder_settings (name, title, bio, image_url)
VALUES (
  'Isaac Ashika Amwayi',
  'Your Go-To Writer for Impactful Words',
  'Isaac Ashika Amwayi is a passionate and highly skilled writer known for turning ideas into powerful written expressions. With a gift for communication and a reputation built across various writing fields, Isaac brings excellence to every project he undertakes. His expertise spans article writing, academic papers, blog content, research projects, proposals, and more.',
  '/src/assets/founder-isaac.jpg'
);