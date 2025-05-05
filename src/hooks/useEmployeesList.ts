
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeListItem {
  id: string;
  full_name: string;
  email: string;
  position: string; // role
  area: string; // department
  status: string;
  photo_url?: string;
  employee_id: string;
}

export const useEmployeesList = (
  searchQuery: string = "",
  departmentFilter: string = "all",
  statusFilter: string = "all"
) => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees-list", searchQuery, departmentFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("employee_registrations")
        .select("*");

      // Apply status filter if not 'all'
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      // Apply department filter if not 'all'
      if (departmentFilter !== "all") {
        query = query.eq("area", departmentFilter);
      }

      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(
          `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,employee_id.ilike.%${searchQuery}%`
        );
      }

      // Get the result
      const { data, error } = await query.order("submission_date", { ascending: false });

      if (error) {
        toast.error("Failed to fetch employees");
        console.error("Error fetching employees:", error);
        return [];
      }

      return data as EmployeeListItem[];
    },
  });

  return { employees: employees || [], isLoading };
};
