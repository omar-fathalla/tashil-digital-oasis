
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { EmployeeRegistration } from "@/hooks/requests/types";

export const useEmployeeRegistrations = () => {
  const queryClient = useQueryClient();

  // Set up Supabase realtime subscription for data changes
  useEffect(() => {
    const channel = supabase
      .channel('registration-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'employee_registrations',
        }, 
        (payload) => {
          console.log('Registration data changed:', payload);
          queryClient.invalidateQueries({ queryKey: ["employee-registrations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: registrations, isLoading, error } = useQuery({
    queryKey: ["employee-registrations"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("employee_registrations")
          .select(`
            id,
            full_name,
            employee_id,
            request_type,
            status,
            submission_date,
            area,
            position,
            national_id,
            phone,
            email,
            photo_url,
            first_name,
            last_name,
            mid_name
          `)
          .order("submission_date", { ascending: false });

        if (error) throw error;

        console.log("Fetched employee registrations:", data.length);

        return data as EmployeeRegistration[];
      } catch (err) {
        console.error("Error fetching employee registrations:", err);
        toast.error("Failed to load registration data");
        throw err;
      }
    },
  });

  return {
    registrations,
    isLoading,
    error,
  };
};
