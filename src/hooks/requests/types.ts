
export type RequestType = "employee" | "company";

export interface EmployeeRegistration {
  id: string;
  employee_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  mid_name?: string | null;
  national_id?: string | null;
  submission_date?: string | null;
  photo_url?: string | null;
  phone?: string | null;
  position?: string | null;
  hire_date?: string | null;
  email?: string | null;
  address?: string | null;
  area?: string | null;
  status?: string;
  request_type?: string;
}

export type EmployeeRequest = {
  id: string;
  employee_name: string;
  employee_id: string;
  request_type: string;
  request_date: string;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  type: RequestType;
  company_name?: string;
  company_number?: string;
  tax_card_number?: string;
  commercial_register_number?: string;
  registration_id?: string | null;
  employee_registrations?: EmployeeRegistration | null;
};

export const REJECTION_REASONS = [
  "Incomplete Information",
  "Invalid Documentation",
  "Duplicate Request",
  "Not Eligible",
  "Request Expired",
  "Other"
] as const;

export type RejectionReason = typeof REJECTION_REASONS[number] | string;
