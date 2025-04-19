
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Application = {
  id: string;
  employee_name: string;
  employee_id: string;
  type: string;
  request_date: string;
  status: "approved" | "rejected" | "under-review";
  notes: string | null;
};

export const useApplications = (filter: string = "all") => {
  return useQuery({
    queryKey: ["applications", filter],
    queryFn: async () => {
      let query = supabase
        .from("employee_registrations")
        .select("*")
        .order("submission_date", { ascending: false });

      // Apply status filter if not "all"
      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Map the data to match our Application type
      return (data || []).map(record => ({
        id: record.id,
        employee_name: record.full_name,
        employee_id: record.employee_id,
        type: record.request_type || "New Registration",
        request_date: record.submission_date || new Date().toISOString(),
        status: (record.status as "approved" | "rejected" | "under-review") || "under-review",
        notes: null
      }));
    },
  });
};
