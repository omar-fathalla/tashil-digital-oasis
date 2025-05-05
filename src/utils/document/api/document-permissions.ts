
import { supabase } from "@/integrations/supabase/client";
import { DocumentPermission, Role } from "../types";

export const documentPermissionsApi = {
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
  }
};
