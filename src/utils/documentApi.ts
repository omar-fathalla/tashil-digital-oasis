
import { supabase } from "@/integrations/supabase/client";

export interface DocumentType {
  id?: string;
  name: string;
  required: boolean;
  instructions?: string;
}

export const documentApi = {
  getAllDocuments: async (): Promise<DocumentType[]> => {
    const { data, error } = await supabase.functions.invoke('api-documents', {
      method: 'GET'
    });

    if (error) throw error;
    return data.data;
  },

  saveDocuments: async (documents: DocumentType[]): Promise<DocumentType[]> => {
    const { data, error } = await supabase.functions.invoke('api-documents', {
      method: 'POST',
      body: { documents }
    });

    if (error) throw error;
    return data.data;
  }
};
