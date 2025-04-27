// First, update the Project type to accept string for status
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string; // Changed from '"active" | "archived" | "in_progress"' to accept any string
  created_at: string;
  updated_at: string;
  user_id: string;
};

export const useProjects = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Cast the data to our Project type
      setProjects(data as Project[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: {
    name: string; // Make name required
    description?: string | null;
    status: "active" | "archived" | "in_progress";
  }) => {
    try {
      // Include the user_id from auth session
      const { data: userData } = await supabase.auth.getSession();
      const userId = userData.session?.user.id;
      
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: projectData.name,
          description: projectData.description || null,
          status: projectData.status
        })
        .select();
      
      if (error) throw error;
      
      await fetchProjects();
      return data[0];
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const updateProject = async (
    projectId: string,
    projectData: {
      name?: string;
      description?: string | null;
      status?: string;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId);

      if (error) throw error;

      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const archiveProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);

      if (error) throw error;

      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    archiveProject,
    deleteProject,
    error,
  };
};
