
import { supabase } from "@/integrations/supabase/client";

export const documentLoggingApi = {
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
  }
};
