
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors, createApiResponse } from '../_shared/cors.ts';
import { getSupabaseClient, verifyAuth } from '../_shared/supabase.ts';

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Parse URL and extract path components
  const url = new URL(req.url);
  const path = url.pathname.split('/');
  const endpoint = path.length > 3 ? path[3] : null;

  // Verify authentication
  const { isAuthorized, userId } = await verifyAuth(req);
  if (!isAuthorized || !userId) {
    return new Response(
      JSON.stringify(createApiResponse(false, null, 'Unauthorized')),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Initialize Supabase client
  const supabase = getSupabaseClient(req.headers.get('Authorization') || '');

  try {
    // Handle metadata endpoint
    if (endpoint === 'metadata') {
      switch (req.method) {
        case 'GET':
          // Get user metadata
          const { data, error } = await supabase
            .from('users_metadata')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (error) throw error;

          return new Response(
            JSON.stringify(createApiResponse(true, data, 'User metadata retrieved successfully')),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'PUT':
          // Update user metadata
          const updateData = await req.json();
          
          // Ensure user_id is set correctly and can't be changed
          updateData.user_id = userId;
          
          const { data: updatedData, error: updateError } = await supabase
            .from('users_metadata')
            .upsert(updateData)
            .select()
            .single();

          if (updateError) throw updateError;

          return new Response(
            JSON.stringify(createApiResponse(true, updatedData, 'User metadata updated successfully')),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        default:
          return new Response(
            JSON.stringify(createApiResponse(false, null, `Method ${req.method} not allowed`)),
            { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }
    }

    // Get user profile information
    if (req.method === 'GET' && !endpoint) {
      // Combine auth user data with metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data: metadataData, error: metadataError } = await supabase
        .from('users_metadata')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (metadataError && metadataError.code !== 'PGRST116') throw metadataError;
      
      const profileData = {
        ...userData.user,
        metadata: metadataData || {}
      };
      
      return new Response(
        JSON.stringify(createApiResponse(true, profileData, 'User profile retrieved successfully')),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(createApiResponse(false, null, 'Invalid endpoint')),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify(createApiResponse(false, null, `Error: ${error.message}`)),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
