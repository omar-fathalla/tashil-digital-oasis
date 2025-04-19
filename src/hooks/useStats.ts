
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStats = () => {
  const { data: totalEmployees = 0, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["total-employees"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("employee_registrations")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: totalCompanies = 0, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["total-companies"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  return {
    totalEmployees,
    totalCompanies,
    isLoading: isLoadingEmployees || isLoadingCompanies,
  };
};
