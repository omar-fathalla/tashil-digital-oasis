
import { supabase } from "@/integrations/supabase/client";
import { DocumentCategory } from "../types";

export const documentCategoriesApi = {
  getCategories: async (): Promise<DocumentCategory[]> => {
    try {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as DocumentCategory[];
    } catch (error) {
      console.error("Error fetching document categories:", error);
      throw error;
    }
  },

  createCategory: async (
    name: string,
    description?: string
  ): Promise<DocumentCategory> => {
    try {
      const { data, error } = await supabase
        .from('document_categories')
        .insert({ name, description })
        .select()
        .single();

      if (error) throw error;
      return data as DocumentCategory;
    } catch (error) {
      console.error("Error creating document category:", error);
      throw error;
    }
  }
};
