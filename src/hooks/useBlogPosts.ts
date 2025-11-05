import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  read_time: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  author_id?: string;
  author_name?: string;
}

export const useBlogPosts = (category?: string, featuredOnly?: boolean) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    // Set up realtime subscription
    const channel = supabase
      .channel("blog_posts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blog_posts",
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category, featuredOnly]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          profiles:author_id (
            full_name
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      if (featuredOnly) {
        query = query.eq("featured", true);
      }

      const { data, error } = await query;

      if (error) throw error;

      const postsWithAuthors = (data || []).map((post: any) => ({
        ...post,
        author_name: (post as any).profiles?.full_name || "Ukweli Media Team",
      }));

      setPosts(postsWithAuthors);
    } catch (err) {
      console.error("Error fetching posts:", err);
      // Fallback: fetch without join so posts still appear
      try {
        let simpleQuery = supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (category) simpleQuery = simpleQuery.eq("category", category);
        if (featuredOnly) simpleQuery = simpleQuery.eq("featured", true);

        const { data: simpleData, error: simpleError } = await simpleQuery;
        if (simpleError) throw simpleError;

        setPosts((simpleData || []).map((p: any) => ({ ...p, author_name: "Ukweli Media Team" })));
      } catch (fallbackErr) {
        console.error("Fallback fetch failed:", fallbackErr);
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, refetch: fetchPosts };
};

export const useBlogPost = (id: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          profiles:author_id (
            full_name
          )
        `)
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const postWithAuthor = {
          ...data,
          author_name: (data as any).profiles?.full_name || "Ukweli Media Team",
        };
        setPost(postWithAuthor);
      } else {
        setPost(null);
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      // Fallback without join
      try {
        const { data: simpleData, error: simpleError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .maybeSingle();

        if (simpleError) throw simpleError;
        setPost(simpleData ? { ...simpleData, author_name: "Ukweli Media Team" } : null);
      } catch (fallbackErr) {
        console.error("Fallback single fetch failed:", fallbackErr);
        setPost(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return { post, loading };
};
