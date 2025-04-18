
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

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
  const { user } = useAuth();

  return useQuery({
    queryKey: ["applications", filter, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("applications")
        .select("*")
        .order("request_date", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching applications:", error);
        throw error;
      }

      return data as Application[];
    },
    enabled: !!user,
  });
};
