import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type RequestType = "employee" | "company";

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

export const useEmployeeRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["employee-requests"],
    queryFn: async () => {
      const [employeeResponse, companyResponse] = await Promise.all([
        supabase
          .from("employee_requests")
          .select("*")
          .order("request_date", { ascending: false }),
        supabase
          .from("companies")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      if (employeeResponse.error) throw employeeResponse.error;
      if (companyResponse.error) throw companyResponse.error;

      const companyRequests = companyResponse.data.map(company => ({
        id: company.id,
        employee_name: company.username,
        employee_id: company.company_number,
        request_type: "Company Registration",
        request_date: company.created_at,
        status: "pending",
        notes: null,
        type: "company" as RequestType,
        company_name: company.company_name,
        company_number: company.company_number,
        tax_card_number: company.tax_card_number,
        commercial_register_number: company.commercial_register_number
      }));

      const employeeRequests = employeeResponse.data.map(req => ({
        ...req,
        type: "employee" as RequestType
      }));

      return [...employeeRequests, ...companyRequests];
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
    updateRequestStatus,
  };
};
