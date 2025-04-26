
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useEffect } from "react";

export type ProjectComment = {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export const useProjectComments = (projectId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchComments = async (): Promise<ProjectComment[]> => {
    const { data, error } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  };

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ['project-comments', projectId],
    queryFn: fetchComments,
    enabled: !!user && !!projectId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('project_comments')
        .insert({
          project_id: projectId,
          user_id: user?.id,
          content,
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', projectId] });
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });

  // Set up realtime subscription for comments
  useEffect(() => {
    if (!user || !projectId) return;

    const channel = supabase
      .channel('public:project_comments')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'project_comments',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['project-comments', projectId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user, queryClient]);

  return {
    comments,
    isLoading,
    error,
    addComment: addCommentMutation.mutateAsync,
  };
};
