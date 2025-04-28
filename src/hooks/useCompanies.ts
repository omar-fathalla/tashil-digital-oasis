import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { mapPartialCompanyToInsertableCompany } from "@/utils/companyMapper";

export interface Company {
  id: string;
  company_name: string;
  address: string;
  tax_card_number: string;
  register_number: string;
  company_number: string;
  commercial_register_url: string | null;
  tax_card_url: string | null;
  created_at: string;
  updated_at: string | null;
  type: string | null;
  user_id: string;
  is_dummy?: boolean;
}

const validateCompany = (company: Partial<Company>): string | null => {
  if (!company.company_name) {
    return "Company name is required";
  }
  if (company.company_name.trim().length === 0) {
    return "Company name cannot be empty";
  }
  return null;
};

export function useCompanies() {
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { user } = useAuth();

  const ensureDemoCompanyForUser = async (email: string) => {
    if (email !== 'omar.ahmed.hassan.fathalla@gmail.com') return;
    
    try {
      await supabase.rpc('ensure_demo_company_data', { user_email: email });
    } catch (error) {
      console.error("Failed to ensure demo company data:", error);
    }
  };

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      if (user?.email) {
        await ensureDemoCompanyForUser(user.email);
      }

      const { data, error } = await supabase
        .from('companies')
        .select('id, company_name, address, tax_card_number, register_number, company_number, commercial_register_url, tax_card_url, created_at, updated_at, type, user_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(company => ({
        id: company.id,
        company_name: company.company_name || '',
        address: company.address || '',
        tax_card_number: company.tax_card_number || '',
        register_number: company.register_number || '',
        company_number: company.company_number || '',
        commercial_register_url: company.commercial_register_url,
        tax_card_url: company.tax_card_url,
        created_at: company.created_at || new Date().toISOString(),
        updated_at: company.updated_at,
        type: company.type,
        user_id: company.user_id || ''
      })) as Company[];
    }
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success("Company deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete company", {
        description: error.message
      });
    }
  });

  const handleUniqueConstraintError = (error: any) => {
    const message = error.message || '';
    if (message.includes('companies_company_number_key')) {
      return "This company number is already in use.";
    }
    if (message.includes('companies_register_number_key')) {
      return "This commercial register number is already in use.";
    }
    return message;
  };

  const updateCompany = useMutation({
    mutationFn: async (updates: Partial<Company> & { id: string }) => {
      const { id, ...companyUpdates } = updates;
      
      const { data, error } = await supabase
        .from('companies')
        .update(companyUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const errorMessage = handleUniqueConstraintError(error);
        throw new Error(errorMessage);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      if (selectedCompany && selectedCompany.id === data.id) {
        setSelectedCompany(data as Company);
      }
    },
    onError: (error) => {
      toast.error("Failed to update company", {
        description: error.message
      });
    }
  });

  const createCompany = useMutation({
    mutationFn: async (company: Partial<Company>) => {
      const validationError = validateCompany(company);
      if (validationError) {
        throw new Error(validationError);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error('You must be logged in to create a company');
      }

      const insertableCompany = mapPartialCompanyToInsertableCompany(company, user.id);

      const { data, error } = await supabase
        .from('companies')
        .insert(insertableCompany)
        .select()
        .single();

      if (error) {
        const errorMessage = handleUniqueConstraintError(error);
        throw new Error(errorMessage);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success("Company created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create company", {
        description: error.message
      });
    }
  });

  return {
    companies,
    isLoading,
    selectedCompany,
    setSelectedCompany,
    deleteCompany,
    createCompany,
    updateCompany,
    ensureDemoCompanyForUser
  };
}
