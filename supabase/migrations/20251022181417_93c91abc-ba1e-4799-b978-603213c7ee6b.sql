-- Enable realtime for blog_posts table
ALTER TABLE public.blog_posts REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;