
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
  name: string;
  type: "advertising" | "product";
};

export type RepWithCompany = Representative & {
  company_name: string;
  company_type: string;
};
