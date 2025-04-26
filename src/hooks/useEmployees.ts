
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Employee } from "@/hooks/useEmployee";

export const useEmployees = () => {
  const queryClient = useQueryClient();

  // Fetch all employees
  const {
    data: employees = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_registrations")
        .select("*")
        .order("submission_date", { ascending: false });

      if (error) throw error;
      return data as Employee[];
    },
  });

  // Update employee status
  const updateEmployeeStatus = useMutation({
    mutationFn: async ({ 
      employeeId, 
      status 
    }: { 
      employeeId: string; 
      status: string;
    }) => {
      const { error } = await supabase
        .from("employee_registrations")
        .update({ status })
        .eq("id", employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update employee status");
      console.error("Error updating employee status:", error);
    },
  });

  // Delete employee
  const deleteEmployee = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from("employee_registrations")
        .delete()
        .eq("id", employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    },
  });

  return {
    employees,
    isLoading,
    error,
    updateEmployeeStatus,
    deleteEmployee,
  };
};
