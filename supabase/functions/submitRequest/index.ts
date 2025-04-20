
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, request_type } = await req.json();

    // Validate required fields
    if (!user_id || !request_type) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: user_id and request_type are required"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert the request
    const { data, error } = await supabaseClient
      .from('requests')
      .insert([
        {
          user_id,
          request_type,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Create a notification for the user
    await supabaseClient
      .from('notifications')
      .insert([{
        user_id,
        title: 'Request Submitted',
        message: `Your ${request_type} request has been submitted and is pending review.`,
        read: false
      }]);

    return new Response(
      JSON.stringify({
        success: true,
        data,
        message: "Request submitted successfully"
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Error in submitRequest function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
