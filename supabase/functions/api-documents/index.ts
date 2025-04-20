
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface DocumentType {
  id?: string;
  name: string;
  required: boolean;
  instructions?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        const { data: documents, error: fetchError } = await supabase
          .from('document_types')
          .select('*')
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        return new Response(JSON.stringify({
          success: true,
          data: documents,
          message: 'Documents retrieved successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'POST':
        const { documents: newDocuments } = await req.json();
        
        // Validate documents
        if (!Array.isArray(newDocuments)) {
          throw new Error('Invalid documents format');
        }

        const { data: savedDocs, error: saveError } = await supabase
          .from('document_types')
          .upsert(newDocuments.map(doc => ({
            name: doc.name,
            required: doc.required,
            instructions: doc.instructions
          })))
          .select();

        if (saveError) throw saveError;

        return new Response(JSON.stringify({
          success: true,
          data: savedDocs,
          message: 'Documents saved successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      default:
        return new Response(JSON.stringify({
          success: false,
          message: 'Method not allowed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        });
    }

  } catch (error) {
    console.error('Error in api-documents function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message === 'Unauthorized' ? 401 : 500,
    });
  }
});
