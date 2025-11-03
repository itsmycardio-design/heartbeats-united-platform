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
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
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
      
      // Map the data to include author_name
      const postsWithAuthors = (data || []).map((post: any) => ({
        ...post,
        author_name: "Ukweli Media Team"
      }));
      
      setPosts(postsWithAuthors);
    } catch (error) {
      console.error("Error fetching posts:", error);
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
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      
      // Map the data to include author_name
      if (data) {
        const postWithAuthor = {
          ...data,
          author_name: "Ukweli Media Team"
        };
        setPost(postWithAuthor);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  return { post, loading };
};
