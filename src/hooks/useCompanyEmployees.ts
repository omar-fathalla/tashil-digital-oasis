
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyEmployee, EmployeeFormData } from "@/types/employee";

export const useCompanyEmployees = (companyId?: string) => {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<CompanyEmployee | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  
  // Fetch company employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["company-employees", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('employee_registrations')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        toast.error("Failed to fetch employees");
        throw error;
      }

      return data as CompanyEmployee[];
    },
    enabled: !!companyId
  });

  // Add a new employee
  const addEmployee = useMutation({
    mutationFn: async ({ 
      employeeData,
      documents
    }: { 
      employeeData: EmployeeFormData,
      documents: Record<string, File>
    }) => {
      if (!companyId) throw new Error("Company ID is required");

      // Upload documents first
      const uploadedDocuments: Record<string, string> = {};
      
      for (const [key, file] of Object.entries(documents)) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('employee-documents')
          .upload(`${companyId}/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('employee-documents')
          .getPublicUrl(uploadData.path);
          
        uploadedDocuments[key] = publicUrl;
      }

      const fullName = `${employeeData.first_name} ${employeeData.mid_name || ''} ${employeeData.last_name}`.trim();
      
      // Create employee record
      const { data, error } = await supabase
        .from('employee_registrations')
        .insert({
          ...employeeData,
          full_name: fullName,
          company_id: companyId,
          status: 'pending',
          employee_id: `EMP-${Date.now().toString().slice(-8)}`, // Generate employee ID
          documents: uploadedDocuments
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-employees", companyId] });
      toast.success("Employee added successfully");
      setIsAddingEmployee(false);
    },
    onError: (error) => {
      toast.error("Failed to add employee: " + error.message);
    }
  });

  // Update employee
  const updateEmployee = useMutation({
    mutationFn: async ({ 
      id,
      employeeData,
      documents
    }: { 
      id: string,
      employeeData: Partial<EmployeeFormData>,
      documents?: Record<string, File>
    }) => {
      if (!companyId) throw new Error("Company ID is required");
      
      let uploadedDocuments: Record<string, string> = {};
      
      // Upload new documents if provided
      if (documents) {
        for (const [key, file] of Object.entries(documents)) {
          const fileName = `${Date.now()}_${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('employee-documents')
            .upload(`${companyId}/${fileName}`, file);
  
          if (uploadError) throw uploadError;
  
          const { data: { publicUrl } } = supabase.storage
            .from('employee-documents')
            .getPublicUrl(uploadData.path);
            
          uploadedDocuments[key] = publicUrl;
        }
      }
      
      // Update full name if first/middle/last name is updated
      let fullNameUpdate = {};
      if (employeeData.first_name || employeeData.mid_name || employeeData.last_name) {
        // Get current employee data
        const { data: currentEmployee } = await supabase
          .from('employee_registrations')
          .select('first_name, mid_name, last_name')
          .eq('id', id)
          .single();
        
        if (currentEmployee) {
          const firstName = employeeData.first_name || currentEmployee.first_name;
          const midName = employeeData.mid_name !== undefined ? employeeData.mid_name : currentEmployee.mid_name;
          const lastName = employeeData.last_name || currentEmployee.last_name;
          const fullName = `${firstName} ${midName || ''} ${lastName}`.trim();
          fullNameUpdate = { full_name: fullName };
        }
      }

      // Update employee record
      const { data, error } = await supabase
        .from('employee_registrations')
        .update({
          ...employeeData,
          ...fullNameUpdate,
          ...(Object.keys(uploadedDocuments).length ? { documents: uploadedDocuments } : {})
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-employees", companyId] });
      toast.success("Employee updated successfully");
      setIsEditingEmployee(false);
      setSelectedEmployee(null);
    },
    onError: (error) => {
      toast.error("Failed to update employee: " + error.message);
    }
  });

  // Delete employee
  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('employee_registrations')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-employees", companyId] });
      toast.success("Employee deleted successfully");
      setSelectedEmployee(null);
    },
    onError: (error) => {
      toast.error("Failed to delete employee: " + error.message);
    }
  });

  return {
    employees,
    isLoading,
    selectedEmployee,
    setSelectedEmployee,
    isAddingEmployee,
    setIsAddingEmployee,
    isEditingEmployee,
    setIsEditingEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
