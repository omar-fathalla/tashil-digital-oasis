
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmployeeRequest } from "./types";
import { getCompanyRequests } from "./mockCompanyData";

export const useEmployeeRequestsFetch = (statusFilter: string = "all") => {
  return useQuery({
    queryKey: ["employee-requests", statusFilter],
    queryFn: async () => {
      console.log(`Fetching employee requests with status filter: ${statusFilter}`);
      try {
        // Start building the employee requests query with registration data
        let employeeQuery = supabase
          .from("employee_requests")
          .select("*, employee_registrations(*)");
        
        // Apply status filter if not "all"
        if (statusFilter !== "all") {
          employeeQuery = employeeQuery.eq("status", statusFilter);
        }
        
        // Complete the query with ordering
        employeeQuery = employeeQuery.order("request_date", { ascending: false });
        
        // Execute the employee requests query
        const employeeResponse = await employeeQuery;
        
        if (employeeResponse.error) throw employeeResponse.error;

        // Log to verify data structure
        if (employeeResponse.data.length > 0) {
          console.log("Sample employee request:", employeeResponse.data[0]);
          
          // Check for linked registration data integrity
          employeeResponse.data.forEach(req => {
            if (req.registration_id && !req.employee_registrations) {
              console.warn(`Request ${req.id} has registration_id ${req.registration_id} but no linked data`);
            }
          });
        } else {
          console.log(`No employee requests found with status filter: ${statusFilter}`);
        }

        const employeeRequests = employeeResponse.data.map(req => ({
          ...req,
          type: "employee" as const
        }));

        // Get company requests (from mock data)
        const companyRequests = getCompanyRequests(statusFilter);

        return [...employeeRequests, ...companyRequests] as EmployeeRequest[];
      } catch (err) {
        console.error("Error fetching employee requests:", err);
        toast.error("Failed to load request data");
        throw err;
      }
    },
  });
};
