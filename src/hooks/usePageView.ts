import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePageView = (pagePath: string, postId?: string) => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Generate or get session ID from localStorage
        let sessionId = localStorage.getItem("session_id");
        if (!sessionId) {
          sessionId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
          localStorage.setItem("session_id", sessionId);
        }

        await supabase.from("page_views").insert({
          page_path: pagePath,
          post_id: postId || null,
          user_id: user?.id || null,
          session_id: sessionId,
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };

    trackPageView();
  }, [pagePath, postId]);
};
