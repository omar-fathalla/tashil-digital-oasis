
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { documentApi, DocumentType } from "@/utils/documentApi";

export const useDocumentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documentTypes = [], isLoading } = useQuery({
    queryKey: ['document-types'],
    queryFn: documentApi.getAllDocuments
  });

  const saveDocumentTypesMutation = useMutation({
    mutationFn: documentApi.saveDocuments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
      toast({
        title: "Success",
        description: "Document settings saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save document settings",
        variant: "destructive",
      });
    }
  });

  const handleAddDocument = (newDocument: DocumentType) => {
    const updatedDocuments = [...documentTypes, newDocument];
    saveDocumentTypesMutation.mutate(updatedDocuments);
  };

  const handleUpdateDocument = (id: string, field: keyof DocumentType, value: string | boolean) => {
    const updatedDocuments = documentTypes.map(doc => {
      if (doc.id === id) {
        return { ...doc, [field]: value };
      }
      return doc;
    });
    
    saveDocumentTypesMutation.mutate(updatedDocuments);
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documentTypes.filter(doc => doc.id !== id);
    saveDocumentTypesMutation.mutate(updatedDocuments);
  };

  return {
    documentTypes,
    isLoading,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument
  };
};
