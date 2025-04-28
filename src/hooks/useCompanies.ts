
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

export function useCompanies() {
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, company_name, address, tax_card_number, register_number, company_number, commercial_register_url, tax_card_url, created_at, updated_at, type, user_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the response to ensure all fields are present with fallbacks for nulls
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
        .delete()
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

  return {
    companies,
    isLoading,
    selectedCompany,
    setSelectedCompany,
    deleteCompany
  };
}
