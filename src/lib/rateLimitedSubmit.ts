import { supabase } from "@/integrations/supabase/client";

type SubmitAction = 'contact' | 'subscribe' | 'comment' | 'page_view';

interface SubmitData {
  [key: string]: string | null | undefined;
}

interface SubmitResult {
  success: boolean;
  error?: string;
  retryAfter?: number;
}

// Client-side throttle tracking
const lastSubmitTime = new Map<string, number>();
const THROTTLE_MS = 3000; // 3 seconds between submissions

export async function rateLimitedSubmit(
  action: SubmitAction,
  data: SubmitData,
  userId?: string
): Promise<SubmitResult> {
  const throttleKey = `${action}:${userId || 'anonymous'}`;
  const now = Date.now();
  const lastTime = lastSubmitTime.get(throttleKey);
  
  // Client-side throttle check
  if (lastTime && now - lastTime < THROTTLE_MS) {
    return {
      success: false,
      error: 'Please wait a moment before submitting again',
      retryAfter: Math.ceil((THROTTLE_MS - (now - lastTime)) / 1000)
    };
  }
  
  try {
    const { data: result, error } = await supabase.functions.invoke('rate-limited-submit', {
      body: { action, data, userId }
    });
    
    if (error) {
      // Check for rate limit error
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        return {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: 60
        };
      }
      throw error;
    }
    
    if (result?.error) {
      return {
        success: false,
        error: result.error,
        retryAfter: result.retryAfter
      };
    }
    
    // Update throttle tracking on success
    lastSubmitTime.set(throttleKey, now);
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Rate limited submit error:', error);
    
    // Handle edge function errors
    if (error && typeof error === 'object' && 'code' in error) {
      const funcError = error as { code: string; message?: string };
      if (funcError.code === 'FunctionsHttpError') {
        return {
          success: false,
          error: 'Service temporarily unavailable. Please try again.',
        };
      }
    }
    
    return {
      success: false,
      error: 'An error occurred. Please try again.',
    };
  }
}
