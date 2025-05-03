
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStats = () => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalCompanies, setTotalCompanies] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard stats from the database function if available
        const { data: statsData, error: statsError } = await supabase.rpc('get_dashboard_stats');
        
        if (statsError) {
          console.log("Error fetching stats via RPC, falling back to direct queries:", statsError);
          // Fall back to direct queries if the function doesn't work
          
          // Count employees
          const { count: employeeCount, error: employeeError } = await supabase
            .from('employee_registrations')
            .select('*', { count: 'exact', head: true });
          
          if (employeeError) throw employeeError;
          
          // Count companies
          const { count: companyCount, error: companyError } = await supabase
            .from('companies')
            .select('*', { count: 'exact', head: true });
          
          if (companyError) throw companyError;

          // Count pending requests
          const { count: requestCount, error: requestError } = await supabase
            .from('registration_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
          
          if (requestError) throw requestError;

          setTotalEmployees(employeeCount || 0);
          setTotalCompanies(companyCount || 0);
          setPendingRequests(requestCount || 0);
        } else {
          // Use the stats from the RPC function
          setTotalEmployees(statsData.totalEmployees || 0);
          setTotalCompanies(statsData.totalCompanies || 0);
          
          // Fetch pending requests count separately if not provided by RPC
          const { count: requestCount, error: requestError } = await supabase
            .from('registration_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
          
          if (requestError) throw requestError;
          setPendingRequests(requestCount || 0);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { totalEmployees, totalCompanies, pendingRequests, isLoading, error };
};
