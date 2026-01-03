-- Fix 1: Restrict profiles table to owner-only access (protect emails)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles for management
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Restrict video uploads to admins and writers only
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

-- Only admins and writers can upload videos
CREATE POLICY "Admins and writers can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-videos' AND
  (public.has_role(auth.uid(), 'admin'::app_role) OR
   public.has_role(auth.uid(), 'writer'::app_role))
);