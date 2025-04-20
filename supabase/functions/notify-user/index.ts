
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getSupabaseClient } from "../_shared/supabase.ts"
import { createApiResponse } from "../_shared/cors.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify(createApiResponse(false, null, 'Missing authorization header')),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabase = getSupabaseClient(authHeader)

    // Get request body
    const { user_id, title, message } = await req.json()

    // Validate required fields
    if (!user_id || !title) {
      return new Response(
        JSON.stringify(createApiResponse(false, null, 'Missing required fields: user_id and title are required')),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create notification
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        message: message || null,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      throw error
    }

    return new Response(
      JSON.stringify(createApiResponse(true, data, 'Notification created successfully')),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in notify-user function:', error)
    return new Response(
      JSON.stringify(createApiResponse(false, null, `Error: ${error.message}`)),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
