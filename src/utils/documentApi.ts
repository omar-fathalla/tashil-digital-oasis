
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types for document management
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

export const DocumentTypes = {
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  JPG: "image/jpeg",
  PNG: "image/png",
  TXT: "text/plain",
};

const DOCUMENTS_BUCKET = 'secure-documents';

export const documentApi = {
  // Document operations
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
      await documentApi.logDocumentAccess(id, 'update');

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
      await documentApi.logDocumentAccess(id, 'delete');

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

  // Version control operations
  getDocumentVersions: async (documentId: string): Promise<DocumentVersion[]> => {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as DocumentVersion[];
    } catch (error) {
      console.error(`Error fetching versions for document ${documentId}:`, error);
      throw error;
    }
  },

  uploadNewVersion: async (
    documentId: string,
    file: File,
    changeSummary?: string
  ): Promise<DocumentVersion> => {
    try {
      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get current version number
      const { data: versions, error: versionError } = await supabase
        .from('document_versions')
        .select('version_number')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false })
        .limit(1);

      if (versionError) throw versionError;

      const nextVersionNumber = versions && versions.length > 0 
        ? versions[0].version_number + 1 
        : 1;

      // Create file path with user ID as folder
      const filePath = `${user.id}/${Date.now()}_v${nextVersionNumber}_${file.name}`;

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

      // Insert version record
      const { data, error } = await supabase.from('document_versions').insert({
        document_id: documentId,
        version_number: nextVersionNumber,
        file_url: publicUrl,
        file_size: file.size,
        created_by: user.id,
        change_summary: changeSummary
      }).select().single();

      if (error) throw error;

      // Log document access
      await documentApi.logDocumentAccess(documentId, 'new_version');

      // Update the main document record with new file info
      await supabase
        .from('documents')
        .update({
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
        })
        .eq('id', documentId);

      return data as DocumentVersion;
    } catch (error) {
      console.error(`Error creating new version for document ${documentId}:`, error);
      throw error;
    }
  },

  // Category operations
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
  },

  // Permission operations
  setDocumentPermissions: async (
    documentId: string,
    roleId: string,
    permissions: {
      canView: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canShare: boolean;
    }
  ): Promise<void> => {
    try {
      // Check if permission already exists
      const { data: existingPermissions, error: fetchError } = await supabase
        .from('document_permissions')
        .select('id')
        .eq('document_id', documentId)
        .eq('role_id', roleId);

      if (fetchError) throw fetchError;

      if (existingPermissions && existingPermissions.length > 0) {
        // Update existing permission
        const { error } = await supabase
          .from('document_permissions')
          .update({
            can_view: permissions.canView,
            can_edit: permissions.canEdit,
            can_delete: permissions.canDelete,
            can_share: permissions.canShare,
          })
          .eq('document_id', documentId)
          .eq('role_id', roleId);

        if (error) throw error;
      } else {
        // Create new permission
        const { error } = await supabase
          .from('document_permissions')
          .insert({
            document_id: documentId,
            role_id: roleId,
            can_view: permissions.canView,
            can_edit: permissions.canEdit,
            can_delete: permissions.canDelete,
            can_share: permissions.canShare,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error(`Error setting permissions for document ${documentId}:`, error);
      throw error;
    }
  },

  getDocumentPermissions: async (documentId: string): Promise<DocumentPermission[]> => {
    try {
      const { data, error } = await supabase
        .from('document_permissions')
        .select(`
          *,
          roles:role_id (
            id,
            name,
            description
          )
        `)
        .eq('document_id', documentId);

      if (error) throw error;
      return data as unknown as DocumentPermission[];
    } catch (error) {
      console.error(`Error fetching permissions for document ${documentId}:`, error);
      throw error;
    }
  },

  // Role operations
  getRoles: async (): Promise<Role[]> => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Role[];
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  // Logging operations
  logDocumentAccess: async (
    documentId: string,
    action: string,
    details?: Record<string, any>
  ): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await supabase.from('document_access_logs').insert({
        document_id: documentId,
        user_id: user.id,
        action,
        details
      });
    } catch (error) {
      console.error(`Error logging document access for ${documentId}:`, error);
      // Don't throw error to prevent disrupting the main operation
    }
  },

  // Document search and filtering
  searchDocuments: async (filters: DocumentSearchFilters): Promise<Document[]> => {
    try {
      return await documentApi.getDocuments(filters);
    } catch (error) {
      console.error("Error searching documents:", error);
      throw error;
    }
  }
};

// Export a hook to use for document management API
export const useDocumentApi = () => {
  const { toast } = useToast();
  
  return {
    ...documentApi,
    uploadWithProgress: async (
      file: File,
      name: string,
      description?: string,
      categoryId?: string,
      keywords?: string[],
      isEncrypted: boolean = false
    ): Promise<Document> => {
      try {
        toast({
          title: 'Uploading document...',
          description: `${name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        });
        
        const result = await documentApi.uploadDocument(
          file, 
          name, 
          description, 
          categoryId, 
          keywords,
          isEncrypted
        );
        
        toast({
          title: 'Upload complete',
          description: `${name} has been uploaded successfully.`,
        });
        
        return result;
      } catch (error: any) {
        toast({
          title: 'Upload failed',
          description: error.message || 'Failed to upload document',
          variant: 'destructive',
        });
        throw error;
      }
    }
  };
};
