
import { faker } from '@faker-js/faker';
import { EmployeeRequest } from "./types";

export const FAKE_COMPANIES = [
  {
    id: "comp-001",
    company_name: "NileWare Technologies",
    username: "Ahmed Mohamed",
    company_number: "EG-20240001",
    tax_card_number: "TAX20240001",
    commercial_register_number: "CR20240001",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "comp-002",
    company_name: "DeltaCorp Solutions",
    username: "Fatima Ibrahim",
    company_number: "EG-20240002",
    tax_card_number: "TAX20240002",
    commercial_register_number: "CR20240002",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "comp-003",
    company_name: "Luxor Innovations",
    username: "Omar Hassan",
    company_number: "EG-20240003",
    tax_card_number: "TAX20240003",
    commercial_register_number: "CR20240003",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
  {
    id: "comp-004",
    company_name: "CairoByte Software",
    username: "Layla Ahmed",
    company_number: "EG-20240004",
    tax_card_number: "TAX20240004",
    commercial_register_number: "CR20240004",
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
  },
  {
    id: "comp-005",
    company_name: "Pharos Solutions",
    username: "Karim Mahmoud",
    company_number: "EG-20240005",
    tax_card_number: "TAX20240005",
    commercial_register_number: "CR20240005",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
];

export const getCompanyRequests = (statusFilter: string = "all"): EmployeeRequest[] => {
  // Generate statuses with a distribution that makes sense
  const statuses: Array<"pending" | "approved" | "rejected"> = [
    "pending", "pending", "pending", // 60% pending
    "approved", // 20% approved
    "rejected"  // 20% rejected
  ];
  
  // Convert fake company data to EmployeeRequest format
  let companyRequests = FAKE_COMPANIES.map((company, index) => ({
    id: company.id,
    employee_name: company.username, // Contact person
    employee_id: company.company_number,
    request_type: "Company Registration",
    request_date: company.created_at,
    status: statuses[index % statuses.length] as "pending" | "approved" | "rejected",
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 }),
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
