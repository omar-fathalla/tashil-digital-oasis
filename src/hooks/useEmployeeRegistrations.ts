
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeRegistration {
  id: string;
  full_name: string;
  employee_id: string;
  request_type: string;
  status: string;
  submission_date: string;
  area?: string;
  position?: string;
  national_id?: string;
  phone?: string;
  email?: string;
}

export const useEmployeeRegistrations = () => {
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
            email
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
