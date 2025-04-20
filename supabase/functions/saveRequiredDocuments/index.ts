import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSupabaseClient = (authHeader: string) => {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = getSupabaseClient(authHeader);

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { documents } = await req.json();
    if (!Array.isArray(documents)) {
      throw new Error('Invalid documents format');
    }

    console.log('Saving required documents:', documents);

    // Upsert the documents into the document_types table
    const { data, error } = await supabase
      .from('document_types')
      .upsert(documents.map(doc => ({
        name: doc.name,
        required: doc.required,
        instructions: doc.instructions
      })))
      .select();

    if (error) {
      console.error('Error saving documents:', error);
      throw error;
    }

    // Log successful save
    console.log('Successfully saved documents:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Documents saved successfully',
        data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in saveRequiredDocuments function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500,
      }
    );
  }
});
