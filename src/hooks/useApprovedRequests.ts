
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApprovedRequests = (limit = 5) => {
  return useQuery({
    queryKey: ['approved-requests', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_approved_requests', { limit_count: limit });
      
      if (error) throw error;
      return data;
    }
  });
};
