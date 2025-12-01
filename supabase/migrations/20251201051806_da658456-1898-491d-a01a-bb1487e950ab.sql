-- Add columns for multiple media files to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS media_files jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.blog_posts.media_files IS 'Array of media files (images/videos) with structure: [{url: string, type: "image"|"video", caption?: string}]';

-- Add a video_url column for main video if needed
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS video_url text;

COMMENT ON COLUMN public.blog_posts.video_url IS 'Main video URL for the post';

-- Create a storage bucket for videos if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-videos',
  'blog-videos',
  true,
  524288000, -- 500MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for blog-videos bucket
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-videos');

CREATE POLICY "Anyone can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-videos');

CREATE POLICY "Users can update own videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-videos' AND auth.uid()::text = (storage.foldername(name))[1]);