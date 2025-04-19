
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export type Employee = {
  id: string;
  full_name: string;
  first_name: string;
  mid_name?: string;
  last_name: string;
  employee_id: string;
  national_id?: string;
  insurance_number?: string;
  position?: string;
  area?: string;
  company_id?: string;
  company_name?: string;
  request_type?: string;
  sex?: string;
  status?: string;
  submission_date?: string;
  photo_url?: string;
  printed?: boolean;
  printed_at?: string;
};

export type EmployeeDocument = {
  id: string;
  employee_id: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
  verified: boolean;
  verification_date?: string;
  notes?: string;
};

export const useEmployee = (employeeId?: string) => {
  const queryClient = useQueryClient();

  // Fetch employee data
  const {
    data: employee,
    isLoading: isLoadingEmployee,
    error: employeeError,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;

      const { data, error } = await supabase
        .from("employee_registrations")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (error) throw error;
      return data as Employee;
    },
    enabled: !!employeeId,
  });

  // Fetch employee documents
  const {
    data: documents = [],
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];

      const { data, error } = await supabase
        .from("employee_documents")
        .select("*")
        .eq("employee_id", employeeId);

      if (error) throw error;
      return data as EmployeeDocument[];
    },
    enabled: !!employeeId,
  });

  // Fetch digital ID
  const {
    data: digitalId,
    isLoading: isLoadingDigitalId,
    error: digitalIdError,
  } = useQuery({
    queryKey: ["digital-id", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;

      const { data, error } = await supabase
        .from("digital_ids")
        .select("*")
        .eq("employee_id", employeeId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // Ignore "No rows found" error
      return data;
    },
    enabled: !!employeeId,
  });

  // Subscribe to real-time updates for employee data
  useEffect(() => {
    if (!employeeId) return;

    const channel = supabase
      .channel('employee-updates')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'employee_registrations',
          filter: `id=eq.${employeeId}`,
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
        }
      )
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'employee_documents',
          filter: `employee_id=eq.${employeeId}`,
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
        }
      )
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'digital_ids',
          filter: `employee_id=eq.${employeeId}`,
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["digital-id", employeeId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [employeeId, queryClient]);

  // Update employee information
  const updateEmployee = useMutation({
    mutationFn: async (updatedEmployee: Partial<Employee>) => {
      if (!employeeId) throw new Error("Employee ID is required");

      const { error } = await supabase
        .from("employee_registrations")
        .update(updatedEmployee)
        .eq("id", employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Employee information updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update employee information");
      console.error("Error updating employee:", error);
    },
  });

  // Upload a document for the employee
  const uploadDocument = useMutation({
    mutationFn: async ({ 
      file, 
      documentType 
    }: { 
      file: File; 
      documentType: string;
    }) => {
      if (!employeeId) throw new Error("Employee ID is required");

      // Upload the file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(`${employeeId}/${documentType}/${fileName}`, file);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(uploadData.path);

      // Create an entry in the employee_documents table
      const { error: dbError } = await supabase
        .from("employee_documents")
        .insert({
          employee_id: employeeId,
          document_type: documentType,
          file_url: publicUrl,
        });

      if (dbError) throw dbError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload document");
      console.error("Error uploading document:", error);
    },
  });

  const isLoading = isLoadingEmployee || isLoadingDocuments || isLoadingDigitalId;
  const error = employeeError || documentsError || digitalIdError;

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
