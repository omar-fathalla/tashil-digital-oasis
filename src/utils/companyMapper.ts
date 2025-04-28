
import { Company } from "@/hooks/useCompanies";

export type InsertableCompany = {
  company_name: string;
  address: string;
  tax_card_number: string;
  register_number: string;
  company_number: string;
  commercial_register_url: string;
  tax_card_url: string;
  type?: string;
  user_id: string; // Required field
  is_dummy?: boolean;
  is_archived?: boolean;
};

export const mapPartialCompanyToInsertableCompany = (
  partialCompany: Partial<Company>,
  userId: string // Required parameter
): InsertableCompany => {
  if (!userId) {
    throw new Error('User ID is required to create a company');
  }

  return {
    company_name: partialCompany.company_name || "",
    address: partialCompany.address || "",
    tax_card_number: partialCompany.tax_card_number || "",
    register_number: partialCompany.register_number || "",
    company_number: partialCompany.company_number || "",
    commercial_register_url: partialCompany.commercial_register_url || "",
    tax_card_url: partialCompany.tax_card_url || "",
    type: partialCompany.type,
    user_id: userId,
    is_dummy: partialCompany.is_dummy || false,
    is_archived: false
  };
};
