
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'archived' | 'in_progress';
  created_at: string;
  updated_at: string;
  user_id?: string;
};

export const useProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  };

  const { data: projects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: !!user,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...newProject,
          user_id: user?.id,
          status: newProject.status || 'active',
        })
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string, [key: string]: any }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const archiveProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString(), 
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects,
    isLoading,
    error,
    refetch,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    archiveProject: archiveProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
  };
};
