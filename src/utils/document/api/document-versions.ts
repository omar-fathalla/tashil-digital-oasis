
import { supabase } from "@/integrations/supabase/client";
import { DocumentVersion } from "../types";
import { DOCUMENTS_BUCKET } from "../constants";
import { documentLoggingApi } from "./document-logging";

export const documentVersionsApi = {
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
      await documentLoggingApi.logDocumentAccess(documentId, 'new_version');

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
  }
};
