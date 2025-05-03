
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApprovedRequests = () => {
  return useQuery({
    queryKey: ["approved-requests"],
    queryFn: async () => {
      try {
        // First try to use the RPC function if available
        const { data: approvedRequests, error: rpcError } = await supabase.rpc(
          'get_approved_requests',
          { limit_count: 5 }
        );

        if (!rpcError && approvedRequests) {
          return approvedRequests;
        }

        // Fall back to direct query if RPC fails
        console.log("RPC error or no data, falling back to direct query:", rpcError);
        const { data, error } = await supabase
          .from('registration_requests')
          .select('*')
          .eq('status', 'approved')
          .order('submission_date', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        console.error("Error fetching approved requests:", error);
        throw error;
      }
    }
  });
};
