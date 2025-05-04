
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeDocument {
  id: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
  verified: boolean;
}

export interface DigitalID {
  id_number: string;
  issue_date: string;
  expiry_date: string;
  status: 'active' | 'pending' | 'expired';
}

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
  printed?: boolean;
  printed_at?: string;
  
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

  // Fetch employee documents
  const {
    data: documents = [],
  } = useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];

      // In a real implementation, this would fetch from a documents table
      // For now, we'll return demo data based on the employee ID
      const demoDocuments: EmployeeDocument[] = [
        {
          id: `${employeeId}-doc-1`,
          document_type: 'id_card',
          file_url: 'https://example.com/documents/id_card.pdf',
          uploaded_at: new Date().toISOString(),
          verified: true
        },
        {
          id: `${employeeId}-doc-2`,
          document_type: 'contract',
          file_url: 'https://example.com/documents/contract.pdf',
          uploaded_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          verified: false
        }
      ];
      
      return demoDocuments;
    },
    enabled: !!employeeId,
  });

  // Fetch digital ID
  const {
    data: digitalId,
  } = useQuery({
    queryKey: ["employee-digital-id", employeeId],
    queryFn: async () => {
      if (!employeeId || !employee || !['approved', 'id_generated', 'id_printed', 'id_collected'].includes(employee.status || '')) {
        return null;
      }

      // In a real implementation, this would fetch from a digital_ids table
      // For now, we'll return demo data
      const demoDigitalId: DigitalID = {
        id_number: `ID-${employee.employee_id}`,
        issue_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: employee.status === 'approved' ? 'pending' : 'active'
      };
      
      return demoDigitalId;
    },
    enabled: !!employeeId && !!employee,
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

  // Upload document
  const uploadDocument = useMutation({
    mutationFn: async ({ file, documentType }: { file: File, documentType: string }) => {
      if (!employeeId) throw new Error("No employee ID provided");
      
      // In a real implementation, this would upload to storage and create a record
      // For now, we'll simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      const newDocument: EmployeeDocument = {
        id: `${employeeId}-${documentType}-${Date.now()}`,
        document_type: documentType,
        file_url: URL.createObjectURL(file), // This would be a storage URL in production
        uploaded_at: new Date().toISOString(),
        verified: false
      };

      // Update cache with the new document
      queryClient.setQueryData(
        ["employee-documents", employeeId],
        (oldData: EmployeeDocument[] = []) => [...oldData, newDocument]
      );
    },
    onError: (error) => {
      toast.error("Failed to upload document");
      console.error("Error uploading document:", error);
    },
  });

  return {
    employee,
    documents,
    digitalId,
    isLoading,
    error,
    updateEmployee,
    uploadDocument,
  };
};

export default useEmployee;
