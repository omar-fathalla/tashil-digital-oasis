
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Permission {
  id: string;
  key: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

// Define a more flexible type for user_roles that can handle potential errors
export interface UserRole {
  role_id: string;
}

export interface User {
  id: string;
  email: string;
  user_roles: UserRole[] | null;
}

export const useRoleManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all permissions
  const {
    data: permissions = [],
    isLoading: permissionsLoading,
    error: permissionsError
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*');

      if (error) throw error;
      return data.map(p => ({
        id: p.id,
        key: p.key,
        name: p.name
      }));
    }
  });

  // Fetch roles with user counts
  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      // Get all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // For each role, get its permissions
      const rolesWithPermissions = await Promise.all(
        rolesData.map(async (role) => {
          // Get role permissions
          const { data: rolePermissions, error: permissionsError } = await supabase
            .from('role_permissions')
            .select('permission_id, permissions!inner(key)')
            .eq('role_id', role.id);
            
          if (permissionsError) throw permissionsError;
          
          // Count users with this role
          const { count, error: countError } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true })
            .eq('role_id', role.id);
            
          if (countError) throw countError;
          
          return {
            id: role.id,
            name: role.name,
            description: role.description || '',
            permissions: rolePermissions.map(rp => rp.permissions.key),
            userCount: count || 0
          };
        })
      );
      
      return rolesWithPermissions;
    }
  });

  // Fetch all users from auth system
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, user_roles(role_id)');

      if (error) throw error;

      // Handle the data to ensure it matches our User type
      return users.map(user => ({
        id: user.id,
        email: user.email,
        // Check if user_roles is an array (valid relation) or something else (error)
        user_roles: Array.isArray(user.user_roles) ? user.user_roles : null
      })) as User[];
    }
  });

  // Create new role
  const createRole = useMutation({
    mutationFn: async ({ name, description, permissions }: { name: string, description: string, permissions: string[] }) => {
      // Insert new role
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .insert({ name, description })
        .select()
        .single();
      
      if (roleError) throw roleError;
      
      // Get the permission IDs for the selected permission keys
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissions')
        .select('id, key')
        .in('key', permissions);
        
      if (permissionError) throw permissionError;
      
      // Link role with permissions
      if (permissionData.length > 0) {
        const rolePermissions = permissionData.map(permission => ({
          role_id: roleData.id,
          permission_id: permission.id
        }));
        
        const { error: linkError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);
          
        if (linkError) throw linkError;
      }
      
      return {
        id: roleData.id,
        name: roleData.name,
        description: roleData.description || '',
        permissions,
        userCount: 0
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Role Created",
        description: "The new role has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Role",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update existing role
  const updateRole = useMutation({
    mutationFn: async ({ id, name, description, permissions }: { id: string, name: string, description: string, permissions: string[] }) => {
      // Update role
      const { error: roleError } = await supabase
        .from('roles')
        .update({ name, description })
        .eq('id', id);
      
      if (roleError) throw roleError;
      
      // Get the permission IDs for the selected permission keys
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissions')
        .select('id, key')
        .in('key', permissions);
        
      if (permissionError) throw permissionError;
      
      // Delete existing role permissions
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', id);
        
      if (deleteError) throw deleteError;
      
      // Link role with new permissions
      if (permissionData.length > 0) {
        const rolePermissions = permissionData.map(permission => ({
          role_id: id,
          permission_id: permission.id
        }));
        
        const { error: linkError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);
          
        if (linkError) throw linkError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Role Updated",
        description: "The role has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Role",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete role
  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Role Deleted",
        description: "The role has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Delete Role",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Assign role to user
  const assignUserRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string, roleId: string }) => {
      // Delete existing user roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
        
      if (deleteError) throw deleteError;
      
      // Assign new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role_id: roleId });
        
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Role Assigned",
        description: "The user's role has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Assign Role",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    permissions,
    roles,
    users,
    isLoading: permissionsLoading || rolesLoading || usersLoading,
    error: permissionsError || rolesError || usersError,
    createRole,
    updateRole,
    deleteRole,
    assignUserRole,
    refetchRoles
  };
};
