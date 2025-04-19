
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

      // For now, we'll check if there's registration data with documents
      const { data, error } = await supabase
        .from("registration_requests")
        .select("documents, full_name, national_id")
        .eq("id", employeeId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // Ignore "No rows found" error
      
      // Convert the documents object to an array of EmployeeDocument objects
      if (data?.documents) {
        const docs: EmployeeDocument[] = [];
        Object.entries(data.documents).forEach(([key, value]) => {
          if (typeof value === 'string') {
            docs.push({
              id: `${employeeId}-${key}`,
              employee_id: employeeId,
              document_type: key,
              file_url: value,
              uploaded_at: new Date().toISOString(),
              verified: false
            });
          }
        });
        return docs;
      }
      
      return [];
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

      // For now, we'll just return placeholder data
      // In a real implementation, you'd query your digital_ids table
      if (employee?.status === 'approved') {
        return {
          id: employeeId,
          employee_id: employeeId,
          id_number: `ID-${employeeId.substring(0, 8)}`,
          issue_date: new Date().toISOString(),
          expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          status: 'active'
        };
      }
      
      return null;
    },
    enabled: !!employeeId && !!employee,
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
          table: 'registration_requests',
          filter: `id=eq.${employeeId}`,
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
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

      // First, get the existing registration request data or create minimal required data
      const { data: existingData, error: fetchError } = await supabase
        .from("registration_requests")
        .select("documents, full_name, national_id")
        .eq("id", employeeId)
        .single();
      
      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
      
      // Prepare documents object
      const documents = existingData?.documents || {};
      documents[documentType] = publicUrl;
      
      if (existingData) {
        // If record exists, update just the documents field
        const { error: updateError } = await supabase
          .from("registration_requests")
          .update({ documents })
          .eq("id", employeeId);
        
        if (updateError) throw updateError;
      } else {
        // If record doesn't exist, we need to get employee data to create a minimal record
        const { data: employeeData, error: employeeError } = await supabase
          .from("employee_registrations")
          .select("full_name, national_id")
          .eq("id", employeeId)
          .single();
        
        if (employeeError) throw employeeError;
        
        // Insert new record with required fields
        const { error: insertError } = await supabase
          .from("registration_requests")
          .insert({
            id: employeeId,
            documents,
            full_name: employeeData.full_name || "Unknown",
            national_id: employeeData.national_id || "Unknown",
          });
        
        if (insertError) throw insertError;
      }

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
