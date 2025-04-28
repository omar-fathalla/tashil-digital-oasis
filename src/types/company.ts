
export interface CompanyDocument {
  id: string;
  company_id: string;
  document_type: 'Commercial Register' | 'Tax Card' | 'Other';
  document_url: string;
  created_at: string;
  description?: string;
}
