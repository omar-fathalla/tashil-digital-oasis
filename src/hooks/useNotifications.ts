
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Notification = {
  id: string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
  user_id: string | null;
  type: string;
};

export const useNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch notifications
  const { 
    data: notifications = [], 
    isLoading,
    error, 
    refetch 
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Notification[];
    },
  });

  // Count unread notifications
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark notification as read: ${error}`,
        variant: "destructive"
      });
    }
  });
  
  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Notification deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete notification: ${error}`,
        variant: "destructive"
      });
    }
  });
  
  // Create wrapper functions that return void promises
  const handleMarkAsRead = async (notificationId: string): Promise<void> => {
    await markAsRead.mutateAsync(notificationId);
  };
  
  const handleDeleteNotification = async (notificationId: string): Promise<void> => {
    await deleteNotification.mutateAsync(notificationId);
  };
  
  return { 
    notifications, 
    isLoading,
    error,
    unreadCount,
    markAsRead: handleMarkAsRead,
    deleteNotification: handleDeleteNotification,
    refetch
  };
};
