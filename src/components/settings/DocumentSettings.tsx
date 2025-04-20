
import { DocumentForm } from "./document-settings/DocumentForm";
import { DocumentList } from "./document-settings/DocumentList";
import { useDocumentSettings } from "./document-settings/useDocumentSettings";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentType } from "@/utils/documentApi";

export const DocumentSettings = () => {
  const {
    documentTypes,
    isLoading,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    refreshDocuments
  } = useDocumentSettings();

  // Subscribe to real-time updates for document types
  useEffect(() => {
    const channel = supabase
      .channel('document-types-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'document_types' 
        },
        (payload) => {
          console.log('Document types updated:', payload);
          refreshDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshDocuments]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Required Documents</h2>
        <p className="text-muted-foreground">
          Configure which documents are required for registration and add specific instructions.
        </p>
      </div>

      <DocumentList
        documents={documentTypes}
        onUpdateDocument={handleUpdateDocument}
        onDeleteDocument={handleDeleteDocument}
      />

      <DocumentForm onAddDocument={handleAddDocument} />
    </div>
  );
};
