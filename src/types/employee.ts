
export interface CompanyEmployee {
  id: string;
  first_name: string;
  mid_name?: string;
  last_name: string;
  full_name: string;
  employee_id: string;
  national_id: string;
  insurance_number: string;
  gender: 'male' | 'female';
  address?: string;
  area?: string;
  email?: string;
  submission_date: string;
  status: 'pending' | 'approved' | 'rejected';
  company_id: string;
  position?: string;
  documents?: EmployeeDocuments;
}

export interface EmployeeDocuments {
  id_card?: string;
  personal_photo?: string;
  insurance_certificate?: string;
  health_certificate?: string;
  q1_form?: string;
  [key: string]: string | undefined;
}

export interface EmployeeFormData {
  first_name: string;
  mid_name?: string;
  last_name: string;
  national_id: string;
  insurance_number: string;
  gender: 'male' | 'female';
  address?: string;
  area?: string;
  email?: string;
  position?: string;
}
