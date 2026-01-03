import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Throttle tracking to prevent excessive page views
const lastPageViewTime = new Map<string, number>();
const THROTTLE_MS = 5000; // 5 seconds between page views for same path

export const usePageView = (pagePath: string, postId?: string) => {
  const hasTracked = useRef(false);
  
  useEffect(() => {
    // Prevent duplicate tracking on re-renders
    if (hasTracked.current) return;
    
    const trackPageView = async () => {
      try {
        // Client-side throttle check
        const throttleKey = `${pagePath}:${postId || ''}`;
        const now = Date.now();
        const lastTime = lastPageViewTime.get(throttleKey);
        
        if (lastTime && now - lastTime < THROTTLE_MS) {
          return; // Skip if recently tracked
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        // Generate or get session ID from localStorage
        let sessionId = localStorage.getItem("session_id");
        if (!sessionId) {
          sessionId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
          localStorage.setItem("session_id", sessionId);
        }

        // Use edge function for rate-limited submission
        const { data, error } = await supabase.functions.invoke('rate-limited-submit', {
          body: {
            action: 'page_view',
            data: {
              page_path: pagePath,
              post_id: postId || null,
              user_id: user?.id || null,
              session_id: sessionId,
            },
            userId: user?.id || sessionId
          }
        });

        if (error) {
          // Silently fail for page views - not critical
          console.debug("Page view tracking skipped:", error.message);
          return;
        }
        
        // Update throttle tracking on success
        lastPageViewTime.set(throttleKey, now);
        hasTracked.current = true;
      } catch (error) {
        // Silently fail - page view tracking is not critical
        console.debug("Error tracking page view:", error);
      }
    };

    trackPageView();
  }, [pagePath, postId]);
};
