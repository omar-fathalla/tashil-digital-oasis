
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type EmployeeRequest = {
  id: string;
  employee_name: string;
  employee_id: string;
  request_type: string;
  request_date: string;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
};

export const useEmployeeRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["employee-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_requests")
        .select("*")
        .order("request_date", { ascending: false });

      if (error) throw error;
      return data as EmployeeRequest[];
    },
  });

  const updateRequestStatus = useMutation({
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

  return {
    requests,
    isLoading,
    updateRequestStatus,
  };
};
