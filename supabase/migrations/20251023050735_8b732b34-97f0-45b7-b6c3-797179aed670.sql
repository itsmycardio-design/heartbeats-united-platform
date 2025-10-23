-- Create subscribers table
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage subscribers"
ON public.subscribers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view and manage messages"
ON public.contact_messages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create theme settings table
CREATE TABLE public.theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text DEFAULT 'News Hub',
  site_logo text,
  primary_color text DEFAULT '#1a1a1a',
  secondary_color text DEFAULT '#f97316',
  font_family text DEFAULT 'Inter',
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view theme settings"
ON public.theme_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage theme settings"
ON public.theme_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default theme settings
INSERT INTO public.theme_settings (site_name) VALUES ('News Hub');

-- Update blog_posts policies to allow writers
CREATE POLICY "Writers can insert their own posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'writer'::app_role) 
  AND author_id = auth.uid()
);

CREATE POLICY "Writers can update their own posts"
ON public.blog_posts
FOR UPDATE
USING (
  has_role(auth.uid(), 'writer'::app_role) 
  AND author_id = auth.uid()
);

CREATE POLICY "Writers can delete their own posts"
ON public.blog_posts
FOR DELETE
USING (
  has_role(auth.uid(), 'writer'::app_role) 
  AND author_id = auth.uid()
);