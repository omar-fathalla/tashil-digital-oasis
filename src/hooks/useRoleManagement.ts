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

export interface User {
  id: string;
  email: string;
  role_id: string | null;
}

export const useRoleManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      const rolesWithPermissions = await Promise.all(
        rolesData.map(async (role) => {
          const { data: rolePermissions, error: permissionsError } = await supabase
            .from('role_permissions')
            .select('permission_id, permissions!inner(key)')
            .eq('role_id', role.id);
            
          if (permissionsError) throw permissionsError;
          
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

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, role_id');

      if (error) throw error;

      return users as User[];
    }
  });

  const createRole = useMutation({
    mutationFn: async ({ name, description, permissions }: { name: string, description: string, permissions: string[] }) => {
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .insert({ name, description })
        .select()
        .single();
      
      if (roleError) throw roleError;
      
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissions')
        .select('id, key')
        .in('key', permissions);
        
      if (permissionError) throw permissionError;
      
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

  const updateRole = useMutation({
    mutationFn: async ({ id, name, description, permissions }: { id: string, name: string, description: string, permissions: string[] }) => {
      const { error: roleError } = await supabase
        .from('roles')
        .update({ name, description })
        .eq('id', id);
      
      if (roleError) throw roleError;
      
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissions')
        .select('id, key')
        .in('key', permissions);
        
      if (permissionError) throw permissionError;
      
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', id);
        
      if (deleteError) throw deleteError;
      
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

  const assignUserRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string, roleId: string }) => {
      const { error: updateError } = await supabase
        .from('users')
        .update({ role_id: roleId })
        .eq('id', userId);
      
      if (updateError) throw updateError;
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
