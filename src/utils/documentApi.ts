
export interface DocumentType {
  id?: string;
  name: string;
  required: boolean;
  instructions?: string;
}

// Remove getAllDocuments and saveDocuments since we're now handling this directly with Supabase
export const documentApi = {};
