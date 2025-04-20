import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './cors.ts';

export const getSupabaseClient = (authHeader: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  
  // If a valid auth header was provided, use it for authenticated requests
  // Otherwise fall back to the service role key for admin operations
  const supabaseKey = authHeader ? supabaseAnonKey : supabaseServiceRoleKey;
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
};

export const handleCORS = (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
};
