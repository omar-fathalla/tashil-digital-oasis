
import { useQuery } from "@tanstack/react-query";

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
      // Generate mock applications
      const applications: Application[] = [];
      const statuses: ("approved" | "rejected" | "under-review")[] = ["approved", "rejected", "under-review"];
      
      for (let i = 0; i < 20; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        if (filter !== "all" && status !== filter) {
          continue;
        }
        
        applications.push({
          id: `app-${i + 1}`,
          employee_name: `Employee ${i + 1}`,
          employee_id: `EMP-${1000 + i}`,
          type: Math.random() > 0.5 ? "New Hire" : "Contractor",
          request_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: status,
          notes: status === "approved" 
            ? "All documents verified." 
            : (status === "rejected" ? "Missing required information." : "Under review.")
        });
      }
      
      return applications;
    },
  });
};
