
import { DocumentForm } from "./document-settings/DocumentForm";
import { DocumentList } from "./document-settings/DocumentList";
import { useDocumentSettings } from "./document-settings/useDocumentSettings";

export const DocumentSettings = () => {
  const {
    documentTypes,
    isLoading,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument
  } = useDocumentSettings();

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
