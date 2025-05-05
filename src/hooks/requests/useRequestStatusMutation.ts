
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRequestStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: { 
      id: string; 
      status: "approved" | "rejected"; 
      notes?: string;
    }) => {
      const { error } = await supabase
        .from("employee_requests")
        .update({ status, notes })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-requests"] });
      toast.success("Request status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update request status");
      console.error("Error updating request:", error);
    },
  });
};
