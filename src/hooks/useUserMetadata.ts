
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

export interface UserMetadata {
  user_id: string;
  username: string;
  mobile_number: string;
  created_at?: string;
  updated_at?: string;
}

export function useUserMetadata() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { data: metadata, isLoading } = useQuery({
    queryKey: ['user-metadata'],
    queryFn: async () => {
      if (!user?.id) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('users_metadata')
        .select('user_id, username, mobile_number, created_at, updated_at')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No metadata found for this user
          return null;
        }
        throw error;
      }
      
      return data as UserMetadata;
    },
    enabled: !!user?.id
  });
  
  const updateMetadata = useMutation({
    mutationFn: async (updates: Partial<UserMetadata>) => {
      if (!user?.id) {
        throw new Error('You must be logged in to update your profile');
      }

      // Ensure required fields are present
      if (!updates.username || !updates.mobile_number) {
        throw new Error('Username and mobile number are required');
      }
      
      const { data, error } = await supabase
        .from('users_metadata')
        .upsert({
          user_id: user.id,
          username: updates.username,
          mobile_number: updates.mobile_number.replace(/[\s-]/g, ''), // Normalize format
          ...updates
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-metadata'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile', {
        description: error.message
      });
    }
  });
  
  return {
    metadata,
    isLoading,
    updateMetadata
  };
}
