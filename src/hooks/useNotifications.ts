
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { toast } from "sonner";

export type Notification = {
  id: string;
  type: "request_submitted" | "request_approved" | "request_rejected" | "id_generated" | "missing_documents" | "document_rejected" | "admin_alert";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata: Record<string, any>;
  request_id?: string;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Subscribe to real-time updates for notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'notifications',
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user]);

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read");
    },
    onError: (error) => {
      toast.error("Failed to update notification");
      console.error("Error updating notification:", error);
    }
  });

  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete notification");
      console.error("Error deleting notification:", error);
    }
  });

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0;

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    deleteNotification,
    unreadCount,
  };
};
