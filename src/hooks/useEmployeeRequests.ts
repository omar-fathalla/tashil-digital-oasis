
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type RequestType = "employee" | "company";

export interface EmployeeRegistration {
  id: string;
  employee_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  mid_name?: string | null;
  national_id?: string | null;
  submission_date?: string | null;
  photo_url?: string | null;
  phone?: string | null;
  position?: string | null;
  hire_date?: string | null;
  email?: string | null;
  address?: string | null;
}

export type EmployeeRequest = {
  id: string;
  employee_name: string;
  employee_id: string;
  request_type: string;
  request_date: string;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  type: RequestType;
  company_name?: string;
  company_number?: string;
  tax_card_number?: string;
  commercial_register_number?: string;
  registration_id?: string | null;
  employee_registrations?: EmployeeRegistration | null;
};

export const REJECTION_REASONS = [
  "Incomplete Information",
  "Invalid Documentation",
  "Duplicate Request",
  "Not Eligible",
  "Request Expired",
  "Other"
] as const;

export type RejectionReason = typeof REJECTION_REASONS[number] | string;

const FAKE_COMPANIES = [
  {
    id: "comp-001",
    company_name: "Tech Solutions Ltd",
    username: "John Smith",
    company_number: "COMP001",
    tax_card_number: "TAX20240001",
    commercial_register_number: "CR20240001",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-002",
    company_name: "Green Energy Co",
    username: "Sarah Johnson",
    company_number: "COMP002",
    tax_card_number: "TAX20240002",
    commercial_register_number: "CR20240002",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-003",
    company_name: "Global Trade Inc",
    username: "Michael Brown",
    company_number: "COMP003",
    tax_card_number: "TAX20240003",
    commercial_register_number: "CR20240003",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-004",
    company_name: "Digital Services Co",
    username: "Emily Davis",
    company_number: "COMP004",
    tax_card_number: "TAX20240004",
    commercial_register_number: "CR20240004",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-005",
    company_name: "Innovation Labs",
    username: "David Wilson",
    company_number: "COMP005",
    tax_card_number: "TAX20240005",
    commercial_register_number: "CR20240005",
    created_at: new Date().toISOString(),
  },
];

export const useEmployeeRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ["employee-requests"],
    queryFn: async () => {
      console.log("Fetching employee requests with linked registration data");
      try {
        const [employeeResponse, companyResponse] = await Promise.all([
          supabase
            .from("employee_requests")
            .select("*, employee_registrations(*)")
            .order("request_date", { ascending: false }),
          supabase
            .from("companies")
            .select("*")
            .order("created_at", { ascending: false })
        ]);

        if (employeeResponse.error) throw employeeResponse.error;
        if (companyResponse.error) throw companyResponse.error;

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
          console.log("No employee requests found");
        }

        const employeeRequests = employeeResponse.data.map(req => ({
          ...req,
          type: "employee" as const
        }));

        const companyRequests = FAKE_COMPANIES.map(company => ({
          id: company.id,
          employee_name: company.username,
          employee_id: company.company_number,
          request_type: "Company Registration",
          request_date: company.created_at,
          status: "pending" as const,
          notes: null,
          type: "company" as const,
          company_name: company.company_name,
          company_number: company.company_number,
          tax_card_number: company.tax_card_number,
          commercial_register_number: company.commercial_register_number
        }));

        return [...employeeRequests, ...companyRequests] as EmployeeRequest[];
      } catch (err) {
        console.error("Error fetching employee requests:", err);
        throw err;
      }
    },
  });

  const updateRequestStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: { 
      id: string; 
      status: "approved" | "rejected"; 
      notes?: string;
    }) => {
      const { error } = await supabase
        .from("employee_requests")
        .update({ status, notes })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-requests"] });
      toast.success("Request status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update request status");
      console.error("Error updating request:", error);
    },
  });

  return {
    requests,
    isLoading,
    error,
    updateRequestStatus,
  };
};
