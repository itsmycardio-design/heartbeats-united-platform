import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory rate limiting store (resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configurations per action type
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  contact: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  subscribe: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  comment: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour (authenticated)
  page_view: { maxRequests: 100, windowMs: 60 * 60 * 1000 }, // 100 per hour (less strict for analytics)
};

function checkRateLimit(identifier: string, action: string): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[action] || { maxRequests: 10, windowMs: 60 * 60 * 1000 };
  const key = `${action}:${identifier}`;
  const now = Date.now();
  
  let record = rateLimitStore.get(key);
  
  // Reset if window has passed
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + config.windowMs };
    rateLimitStore.set(key, record);
  }
  
  const remaining = config.maxRequests - record.count;
  const resetIn = Math.ceil((record.resetTime - now) / 1000);
  
  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetIn };
  }
  
  record.count++;
  return { allowed: true, remaining: remaining - 1, resetIn };
}

function getClientIdentifier(req: Request): string {
  // Try to get real IP from various headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a hash of user-agent + accept-language for basic fingerprinting
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const acceptLanguage = req.headers.get('accept-language') || 'unknown';
  return `ua:${btoa(userAgent + acceptLanguage).slice(0, 20)}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data, userId } = await req.json();
    
    if (!action || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing action or data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get identifier for rate limiting
    const clientIp = getClientIdentifier(req);
    const identifier = userId || clientIp;
    
    console.log(`Rate limit check for action: ${action}, identifier: ${identifier}`);
    
    // Check rate limit
    const rateLimit = checkRateLimit(identifier, action);
    
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for ${action} by ${identifier}`);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimit.resetIn 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': rateLimit.resetIn.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetIn.toString()
          } 
        }
      );
    }

    // Create Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result;

    switch (action) {
      case 'contact': {
        // Validate contact message data
        if (!data.name || !data.email || !data.subject || !data.message) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields: name, email, subject, message' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return new Response(
            JSON.stringify({ error: 'Invalid email format' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Validate field lengths
        if (data.name.length > 100 || data.email.length > 255 || data.subject.length > 200 || data.message.length > 5000) {
          return new Response(
            JSON.stringify({ error: 'Field length exceeds maximum allowed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = await supabase.from('contact_messages').insert([{
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          subject: data.subject.trim(),
          message: data.message.trim()
        }]);
        break;
      }

      case 'subscribe': {
        if (!data.email) {
          return new Response(
            JSON.stringify({ error: 'Email is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return new Response(
            JSON.stringify({ error: 'Invalid email format' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (data.email.length > 255) {
          return new Response(
            JSON.stringify({ error: 'Email length exceeds maximum allowed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = await supabase.from('subscribers').insert([{
          email: data.email.trim().toLowerCase()
        }]);
        break;
      }

      case 'comment': {
        if (!data.post_id || !data.content || !data.author_name || !data.author_email) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (data.content.length > 2000 || data.author_name.length > 100 || data.author_email.length > 255) {
          return new Response(
            JSON.stringify({ error: 'Field length exceeds maximum allowed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = await supabase.from('comments').insert([{
          post_id: data.post_id,
          user_id: data.user_id || null,
          author_name: data.author_name.trim(),
          author_email: data.author_email.trim().toLowerCase(),
          content: data.content.trim(),
          is_approved: false
        }]);
        break;
      }

      case 'page_view': {
        if (!data.page_path) {
          return new Response(
            JSON.stringify({ error: 'page_path is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (data.page_path.length > 500) {
          return new Response(
            JSON.stringify({ error: 'page_path length exceeds maximum allowed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = await supabase.from('page_views').insert([{
          page_path: data.page_path,
          post_id: data.post_id || null,
          user_id: data.user_id || null,
          session_id: data.session_id || null
        }]);
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      console.error(`Database error for ${action}:`, result.error);
      
      // Handle duplicate email for subscribers
      if (action === 'subscribe' && result.error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Already subscribed!' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to process request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully processed ${action} from ${identifier}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetIn: rateLimit.resetIn
        }
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetIn.toString()
        } 
      }
    );

  } catch (error) {
    console.error('Error in rate-limited-submit:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
