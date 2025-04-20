
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAuth } from "../_shared/supabase.ts";
import { createApiResponse } from "../_shared/cors.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authResult = await verifyAuth(req);
    if (!authResult.isAuthorized) {
      return new Response(
        JSON.stringify(createApiResponse(false, null, 'Unauthorized')),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { request_id } = await req.json();

    // Validate input
    if (!request_id) {
      return new Response(
        JSON.stringify(createApiResponse(false, null, 'Request ID is required')),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the request details to find the user_id
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select('user_id, request_type')
      .eq('id', request_id)
      .single();

    if (requestError || !requestData) {
      return new Response(
        JSON.stringify(createApiResponse(false, null, 'Request not found')),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update request status to approved
    const { error: updateError } = await supabase
      .from('requests')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString() 
      })
      .eq('id', request_id);

    if (updateError) {
      throw updateError;
    }

    // Create a notification for the user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: requestData.user_id,
        title: 'Request Approved',
        message: `Your ${requestData.request_type} request has been approved.`,
        read: false
      });

    if (notificationError) {
      throw notificationError;
    }

    // Return success response
    return new Response(
      JSON.stringify(createApiResponse(true, { request_id }, 'Request approved successfully')),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in approveRequest function:', error);
    return new Response(
      JSON.stringify(createApiResponse(false, null, `Error: ${error.message}`)),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
