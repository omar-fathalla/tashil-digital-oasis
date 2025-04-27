
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  title: string;
  message: string | null;
  created_at: string;
  user_id: string | null;
  read: boolean | null;
  type?: string;
  metadata?: any;
}

export const useNotifications = () => {
  const fetchNotifications = async (): Promise<Notification[]> => {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
    
    // Cast data to our Notification type
    return (data || []) as Notification[];
  };
  
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    },
    onSuccess: () => {
      refetch();
    },
  });

  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    error,
    refetch,
    markAsRead,
    deleteNotification,
    unreadCount,
  };
};
