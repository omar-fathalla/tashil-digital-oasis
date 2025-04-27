
export type Representative = {
  id: string;
  full_name: string;
  type: string; // Changed from "promo" | "company" to string to match Supabase
  company_id: string | null;
  value: number;
  created_at: string;
  employee_id?: string | null;
  photo_url?: string | null;
};

export type Company = {
  id: string;
  company_name: string;
  type: string;
};

export type RepWithCompany = Representative & {
  company_name: string;
  company_type: string;
};
