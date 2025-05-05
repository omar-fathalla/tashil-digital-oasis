
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentSearchFilters } from "../types";
import { DOCUMENTS_BUCKET } from "../constants";

// Document CRUD operations
export const documentCrudApi = {
  getDocuments: async (filters?: DocumentSearchFilters): Promise<Document[]> => {
    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          document_categories(*),
          document_permissions!inner(*)
        `);

      // Apply filters
      if (filters?.searchTerm) {
        const term = `%${filters.searchTerm}%`;
        query = query.or(`name.ilike.${term},description.ilike.${term}`);
      }

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      if (filters?.uploadedBy) {
        query = query.eq('uploaded_by', filters.uploadedBy);
      }

      if (filters?.fileTypes?.length) {
        query = query.in('file_type', filters.fileTypes);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Document[];
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  getDocumentById: async (id: string): Promise<Document | null> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          document_categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Document;
    } catch (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
  },

  uploadDocument: async (
    file: File,
    name: string,
    description?: string,
    categoryId?: string,
    keywords?: string[],
    isEncrypted: boolean = false
  ): Promise<Document> => {
    try {
      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create file path with user ID as folder
      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      // Upload file to storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get file URL
      const { data: { publicUrl } } = supabase.storage
        .from(DOCUMENTS_BUCKET)
        .getPublicUrl(filePath);

      // Insert document record
      const { data, error } = await supabase.from('documents').insert({
        name,
        description,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        category_id: categoryId,
        uploaded_by: user.id,
        is_encrypted: isEncrypted,
        metadata: {
          originalName: file.name,
          lastModified: file.lastModified,
        },
        keywords
      }).select().single();

      if (error) throw error;
      return data as Document;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  updateDocument: async (
    id: string,
    updates: {
      name?: string;
      description?: string;
      categoryId?: string;
      keywords?: string[];
    }
  ): Promise<Document> => {
    try {
      // Log document access
      await documentLoggingApi.logDocumentAccess(id, 'update');

      // Update the document
      const { data, error } = await supabase
        .from('documents')
        .update({
          name: updates.name,
          description: updates.description,
          category_id: updates.categoryId,
          keywords: updates.keywords,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    } catch (error) {
      console.error(`Error updating document with ID ${id}:`, error);
      throw error;
    }
  },

  deleteDocument: async (id: string): Promise<void> => {
    try {
      // Get document to get file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Log document access
      await documentLoggingApi.logDocumentAccess(id, 'delete');

      // Delete the document record
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Extract path from URL
      const fileUrl = document.file_url;
      const urlParts = fileUrl.split('/');
      const filePath = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];

      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  },

  searchDocuments: async (filters: DocumentSearchFilters): Promise<Document[]> => {
    try {
      return await documentCrudApi.getDocuments(filters);
    } catch (error) {
      console.error("Error searching documents:", error);
      throw error;
    }
  }
};

// This is needed because documentLoggingApi is imported at the bottom but used here
// We need to forward declare it to avoid circular dependencies
import { documentLoggingApi } from "./document-logging";
