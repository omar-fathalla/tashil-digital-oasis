import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

export const verifyAuth = async (req: Request): Promise<{ isAuthorized: boolean; userId?: string }> => {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return { isAuthorized: false };
  }
  
  try {
    const supabase = getSupabaseClient(authHeader);
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('Auth verification error:', error);
      return { isAuthorized: false };
    }
    
    return { 
      isAuthorized: true,
      userId: user.id 
    };
  } catch (error) {
    console.error('Auth verification exception:', error);
    return { isAuthorized: false };
  }
};
