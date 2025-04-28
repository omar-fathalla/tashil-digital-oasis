
export interface EmployeeDetails {
  name: string;
  position: string;
  department?: string;
  email?: string;
  phone?: string;
  photo_url?: string;
}

export interface RegistrationRequest {
  id: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
  employee_details: EmployeeDetails;
  company_id?: string;
  reviewer_id?: string;
  notes?: string;
  updated_at?: string;
  documents?: any[];
}
