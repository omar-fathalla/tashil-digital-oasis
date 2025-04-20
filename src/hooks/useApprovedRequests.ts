
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApprovedRequests = () => {
  return useQuery({
    queryKey: ['approved-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('status', 'approved')
        .order('submission_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });
};
