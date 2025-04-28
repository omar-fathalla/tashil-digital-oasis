
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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Company[];
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
