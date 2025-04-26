
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

export type ProjectActivity = {
  id: string;
  project_id: string;
  user_id: string;
  action: string;
  description: string;
  timestamp: string;
};

export const useProjectActivities = (projectId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchActivities = async (): Promise<ProjectActivity[]> => {
    const { data, error } = await supabase
      .from('project_activities')
      .select('*')
      .eq('project_id', projectId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['project-activities', projectId],
    queryFn: fetchActivities,
    enabled: !!user && !!projectId,
  });

  // Set up realtime subscription for activities
  useEffect(() => {
    if (!user || !projectId) return;

    const channel = supabase
      .channel('public:project_activities')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_activities',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['project-activities', projectId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user, queryClient]);

  return {
    activities,
    isLoading,
    error,
  };
};
