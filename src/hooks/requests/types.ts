
// Define various request types used throughout the application

export interface EmployeeRequest {
  id: string;
  employee_name: string;
  employee_id: string;
  request_type: string;
  status: string;
  request_date: string;
  company_name?: string;
  company_number?: string;
  tax_card_number?: string;
  commercial_register_number?: string;
  notes?: string;
  type: string;
  registration_id?: string;
  employee_registrations?: EmployeeRegistration;
}

export interface EmployeeRegistration {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  mid_name?: string;
  employee_id: string;
  request_type?: string;
  status?: string;
  submission_date?: string;
  area?: string;
  position?: string;
  national_id?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
  company_id?: string;
  company_name?: string;
  sex?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  hire_date?: string;
  printed?: boolean;
  printed_at?: string;
  collected_at?: string;
  collector_name?: string;
}

export type RequestDetailsData = EmployeeRequest | EmployeeRegistration;
