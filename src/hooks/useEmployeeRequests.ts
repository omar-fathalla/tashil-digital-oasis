
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeRequestsFetch } from "./requests/useEmployeeRequestsFetch";
import { useRequestStatusMutation } from "./requests/useRequestStatusMutation";

// Re-export types from the types file
export * from "./requests/types";

export const useEmployeeRequests = (statusFilter: string = "all") => {
  const queryClient = useQueryClient();
  const { data: requests = [], isLoading, error } = useEmployeeRequestsFetch(statusFilter);
  const updateRequestStatus = useRequestStatusMutation();

  // Set up realtime subscription for request updates
  useEffect(() => {
    const channel = supabase
      .channel('requests-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'employee_requests',
        }, 
        (payload) => {
          // We'll let React Query handle refetching the data
          console.log('Employee request changed:', payload);
          queryClient.invalidateQueries({ queryKey: ["employee-requests"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    requests,
    isLoading,
    error,
    updateRequestStatus,
  };
};
