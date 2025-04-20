
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      
      if (error) throw error;
      return {
        totalEmployees: data.totalEmployees || 0,
        totalCompanies: data.totalCompanies || 0
      };
    },
  });

  return {
    totalEmployees: stats?.totalEmployees ?? 0,
    totalCompanies: stats?.totalCompanies ?? 0,
    isLoading,
  };
};
