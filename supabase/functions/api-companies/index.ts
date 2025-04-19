
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
  const companyId = path.length > 3 ? path[3] : null;

  // Verify authentication
  const { isAuthorized, userId } = await verifyAuth(req);
  if (!isAuthorized) {
    return new Response(
      JSON.stringify(createApiResponse(false, null, 'Unauthorized')),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Initialize Supabase client
  const supabase = getSupabaseClient(req.headers.get('Authorization') || '');

  try {
    switch (req.method) {
      case 'GET':
        if (companyId) {
          // Get a single company by id
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyId)
            .maybeSingle();

          if (error) throw error;

          if (!data) {
            return new Response(
              JSON.stringify(createApiResponse(false, null, 'Company not found')),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(createApiResponse(true, data, 'Company retrieved successfully')),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all companies
          const { data, error } = await supabase
            .from('companies')
            .select('*');

          if (error) throw error;

          return new Response(
            JSON.stringify(createApiResponse(true, data, 'Companies retrieved successfully')),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        // Create a new company
        const createData = await req.json();
        
        // Add user_id if not present
        if (!createData.user_id) {
          createData.user_id = userId;
        }

        const { data: createdData, error: createError } = await supabase
          .from('companies')
          .insert(createData)
          .select()
          .maybeSingle();

        if (createError) throw createError;

        return new Response(
          JSON.stringify(createApiResponse(true, createdData, 'Company created successfully')),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        // Update a company
        if (!companyId) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Company ID is required')),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData = await req.json();
        const { data: updatedData, error: updateError } = await supabase
          .from('companies')
          .update(updateData)
          .eq('id', companyId)
          .select()
          .maybeSingle();

        if (updateError) throw updateError;

        if (!updatedData) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Company not found')),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(createApiResponse(true, updatedData, 'Company updated successfully')),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'DELETE':
        // Delete a company
        if (!companyId) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Company ID is required')),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await supabase
          .from('companies')
          .delete()
          .eq('id', companyId);

        if (deleteError) throw deleteError;

        return new Response(
          JSON.stringify(createApiResponse(true, null, 'Company deleted successfully')),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify(createApiResponse(false, null, `Method ${req.method} not allowed`)),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify(createApiResponse(false, null, `Error: ${error.message}`)),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
