
// Exported types for document management
export interface Document {
  id: string;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  is_encrypted: boolean;
  metadata: Record<string, any>;
  keywords?: string[];
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_url: string;
  file_size: number;
  created_by: string;
  created_at: string;
  change_summary?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentPermission {
  id: string;
  document_id: string;
  role_id: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_share: boolean;
}

export interface DocumentSearchFilters {
  searchTerm?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  uploadedBy?: string;
  fileTypes?: string[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface DocumentType {
  id?: string;
  name: string;
  required?: boolean;
  instructions?: string;
  created_at?: string;
  updated_at?: string;
}

export const DocumentTypes = {
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  JPG: "image/jpeg",
  PNG: "image/png",
  TXT: "text/plain",
};
