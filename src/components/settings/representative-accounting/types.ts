
export type Representative = {
  id: string;
  full_name: string;
  type: "promo" | "company";
  company_id: string | null;
  value: number;
  created_at: string;
};

export type Company = {
  id: string;
  company_name: string;  // Changed from name to company_name to match the database schema
  type: "advertising" | "product";
};

export type RepWithCompany = Representative & {
  company_name: string;
  company_type: string;
};
