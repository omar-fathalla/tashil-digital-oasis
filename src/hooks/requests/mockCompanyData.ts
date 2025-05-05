
import { EmployeeRequest } from "./types";

export const FAKE_COMPANIES = [
  {
    id: "comp-001",
    company_name: "Tech Solutions Ltd",
    username: "John Smith",
    company_number: "COMP001",
    tax_card_number: "TAX20240001",
    commercial_register_number: "CR20240001",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-002",
    company_name: "Green Energy Co",
    username: "Sarah Johnson",
    company_number: "COMP002",
    tax_card_number: "TAX20240002",
    commercial_register_number: "CR20240002",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-003",
    company_name: "Global Trade Inc",
    username: "Michael Brown",
    company_number: "COMP003",
    tax_card_number: "TAX20240003",
    commercial_register_number: "CR20240003",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-004",
    company_name: "Digital Services Co",
    username: "Emily Davis",
    company_number: "COMP004",
    tax_card_number: "TAX20240004",
    commercial_register_number: "CR20240004",
    created_at: new Date().toISOString(),
  },
  {
    id: "comp-005",
    company_name: "Innovation Labs",
    username: "David Wilson",
    company_number: "COMP005",
    tax_card_number: "TAX20240005",
    commercial_register_number: "CR20240005",
    created_at: new Date().toISOString(),
  },
];

export const getCompanyRequests = (statusFilter: string = "all"): EmployeeRequest[] => {
  // Convert fake company data to EmployeeRequest format
  let companyRequests = FAKE_COMPANIES.map(company => ({
    id: company.id,
    employee_name: company.username,
    employee_id: company.company_number,
    request_type: "Company Registration",
    request_date: company.created_at,
    status: "pending" as const,
    notes: null,
    type: "company" as const,
    company_name: company.company_name,
    company_number: company.company_number,
    tax_card_number: company.tax_card_number,
    commercial_register_number: company.commercial_register_number
  }));
  
  // Apply status filtering if needed
  if (statusFilter !== "all") {
    companyRequests = companyRequests.filter(req => req.status === statusFilter);
  }
  
  return companyRequests;
};
