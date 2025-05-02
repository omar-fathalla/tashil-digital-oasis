
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UserMetadata {
  user_id: string;
  username: string;
  mobile_number: string;
  created_at?: string;
  updated_at?: string;
}

// Mock metadata for public access
const mockMetadata: UserMetadata = {
  user_id: "public-access",
  username: "Public User",
  mobile_number: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function useUserMetadata() {
  const queryClient = useQueryClient();
  
  const { data: metadata, isLoading } = useQuery({
    queryKey: ['user-metadata'],
    queryFn: async () => {
      return mockMetadata;
    }
  });
  
  const updateMetadata = useMutation({
    mutationFn: async (updates: Partial<UserMetadata>) => {
      // Simulate successful update
      const updatedMetadata = {
        ...mockMetadata,
        ...updates
      };
      
      return updatedMetadata;
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
