
import { api } from "@/utils/api";
import { toast } from "sonner";
import { Company } from "@/hooks/useCompanies";

export async function seedSampleCompanies(): Promise<boolean> {
  try {
    const response = await api.companies.seedSample();
    
    if (response.success) {
      toast.success(response.message || "Sample companies added successfully");
      return true;
    } else {
      toast.error(response.message || "Failed to add sample companies");
      return false;
    }
  } catch (error) {
    console.error("Error seeding sample companies:", error);
    toast.error("An error occurred while adding sample companies");
    return false;
  }
}

export async function validateCompanyFields(company: Partial<Company>): Promise<string | null> {
  // Validate required fields
  if (!company.company_name?.trim()) {
    return "Company name is required";
  }
  
  if (!company.register_number?.trim()) {
    return "Registration number is required";
  }
  
  if (!company.address?.trim()) {
    return "Company address is required";
  }
  
  if (!company.company_number?.trim()) {
    return "Company number is required";
  }
  
  return null; // All validations passed
}
