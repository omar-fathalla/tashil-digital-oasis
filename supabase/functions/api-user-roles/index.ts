
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { getSupabaseClient, verifyAuth } from '../_shared/supabase.ts'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const { isAuthorized, userId } = await verifyAuth(req)
    if (!isAuthorized) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    
    const supabase = getSupabaseClient(req.headers.get('Authorization') || '')

    // GET /api-user-roles
    if (req.method === 'GET' && !path) {
      // Get all roles with their permissions
      const { data: roles, error: rolesError } = await supabase
        .from('roles')
        .select('*')
      
      if (rolesError) {
        throw rolesError
      }

      // For each role, get its permissions
      const rolesWithPermissions = await Promise.all(
        roles.map(async (role) => {
          // Get role permissions
          const { data: rolePermissions, error: permissionsError } = await supabase
            .from('role_permissions')
            .select('permission_id, permissions!inner(key)')
            .eq('role_id', role.id)
            
          if (permissionsError) {
            throw permissionsError
          }
          
          // Count users with this role
          const { count, error: countError } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true })
            .eq('role_id', role.id)
            
          if (countError) {
            throw countError
          }
          
          return {
            id: role.id,
            name: role.name,
            description: role.description || '',
            permissions: rolePermissions.map((rp: any) => rp.permissions.key),
            userCount: count || 0
          }
        })
      )
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: rolesWithPermissions,
          message: 'Roles retrieved successfully'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // POST /api-user-roles
    if (req.method === 'POST' && !path) {
      const { name, description, permissions } = await req.json()
      
      // Insert new role
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .insert({ name, description })
        .select()
        .single()
      
      if (roleError) {
        throw roleError
      }
      
      // Get the permission IDs for the selected permission keys
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissions')
        .select('id, key')
        .in('key', permissions)
        
      if (permissionError) {
        throw permissionError
      }
      
      // Link role with permissions
      if (permissionData.length > 0) {
        const rolePermissions = permissionData.map((permission) => ({
          role_id: role.id,
          permission_id: permission.id
        }))
        
        const { error: linkError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions)
          
        if (linkError) {
          throw linkError
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            id: role.id,
            name: role.name,
            description: role.description || '',
            permissions
          },
          message: 'Role created successfully'
        }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // PUT /api-user-roles/:id
    if (req.method === 'PUT' && path) {
      const { name, description, permissions } = await req.json()
      
      // Update role
      const { error: roleError } = await supabase
        .from('roles')
        .update({ name, description })
        .eq('id', path)
      
      if (roleError) {
        throw roleError
      }
      
      // Get the permission IDs for the selected permission keys
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissions')
        .select('id, key')
        .in('key', permissions)
        
      if (permissionError) {
        throw permissionError
      }
      
      // Delete existing role permissions
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', path)
        
      if (deleteError) {
        throw deleteError
      }
      
      // Link role with new permissions
      if (permissionData.length > 0) {
        const rolePermissions = permissionData.map((permission) => ({
          role_id: path,
          permission_id: permission.id
        }))
        
        const { error: linkError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions)
          
        if (linkError) {
          throw linkError
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Role updated successfully' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // DELETE /api-user-roles/:id
    if (req.method === 'DELETE' && path) {
      // Delete the role - the cascade constraints will handle the related entries
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', path)
        
      if (error) {
        throw error
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Role deleted successfully' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If the request doesn't match any known route
    return new Response(
      JSON.stringify({ success: false, message: 'Not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
