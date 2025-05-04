
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Employee {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  mid_name?: string;
  employee_id: string;
  position?: string;
  sex?: string;
  area?: string;
  status?: string;
  company_id?: string;
  company_name?: string;
  submission_date?: string;
  request_type?: string;
  photo_url?: string;
  national_id?: string;
  insurance_number?: string;
  
  // Additional fields for detailed employee profiles
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  hire_date?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

export const useEmployee = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: employee,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;

      const { data, error } = await supabase
        .from("employee_registrations")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Record not found
          return null;
        }
        throw error;
      }

      return data as Employee;
    },
    enabled: !!employeeId,
  });

  // Update employee
  const updateEmployee = useMutation({
    mutationFn: async (updatedEmployee: Partial<Employee>) => {
      if (!employeeId) throw new Error("No employee ID provided");

      const { error } = await supabase
        .from("employee_registrations")
        .update(updatedEmployee)
        .eq("id", employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Employee updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update employee");
      console.error("Error updating employee:", error);
    },
  });

  return {
    employee,
    isLoading,
    error,
    updateEmployee,
  };
};

export default useEmployee;
