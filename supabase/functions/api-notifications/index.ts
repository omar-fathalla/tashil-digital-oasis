
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
  const notificationId = path.length > 3 ? path[3] : null;

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
        if (notificationId) {
          // Get a single notification by id
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', notificationId)
            .maybeSingle();

          if (error) throw error;

          if (!data) {
            return new Response(
              JSON.stringify(createApiResponse(false, null, 'Notification not found')),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Check if the notification belongs to the authenticated user
          if (data.recipient_id !== userId) {
            return new Response(
              JSON.stringify(createApiResponse(false, null, 'Unauthorized to access this notification')),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(createApiResponse(true, data, 'Notification retrieved successfully')),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all notifications for the authenticated user
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(
            JSON.stringify(createApiResponse(true, data, 'Notifications retrieved successfully')),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        // Create a new notification
        const createData = await req.json();
        
        // Ensure recipient_id is set
        if (!createData.recipient_id) {
          createData.recipient_id = userId; // Default to creating for current user
        }

        const { data: createdData, error: createError } = await supabase
          .from('notifications')
          .insert(createData)
          .select()
          .maybeSingle();

        if (createError) throw createError;

        return new Response(
          JSON.stringify(createApiResponse(true, createdData, 'Notification created successfully')),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        // Update a notification (e.g., mark as read)
        if (!notificationId) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Notification ID is required')),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // First check if notification exists and belongs to user
        const { data: existingNotification, error: fetchError } = await supabase
          .from('notifications')
          .select('recipient_id')
          .eq('id', notificationId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingNotification) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Notification not found')),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (existingNotification.recipient_id !== userId) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Unauthorized to update this notification')),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData = await req.json();
        const { data: updatedData, error: updateError } = await supabase
          .from('notifications')
          .update(updateData)
          .eq('id', notificationId)
          .select()
          .maybeSingle();

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify(createApiResponse(true, updatedData, 'Notification updated successfully')),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'DELETE':
        // Delete a notification
        if (!notificationId) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Notification ID is required')),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // First check if notification exists and belongs to user
        const { data: notificationToDelete, error: fetchDeleteError } = await supabase
          .from('notifications')
          .select('recipient_id')
          .eq('id', notificationId)
          .maybeSingle();

        if (fetchDeleteError) throw fetchDeleteError;

        if (!notificationToDelete) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Notification not found')),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (notificationToDelete.recipient_id !== userId) {
          return new Response(
            JSON.stringify(createApiResponse(false, null, 'Unauthorized to delete this notification')),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId);

        if (deleteError) throw deleteError;

        return new Response(
          JSON.stringify(createApiResponse(true, null, 'Notification deleted successfully')),
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
