
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { documentApi, DocumentType } from "@/utils/documentApi";
import { supabase } from "@/integrations/supabase/client";

export const useDocumentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documentTypes = [], isLoading, refetch: refreshDocuments } = useQuery({
    queryKey: ['document-types'],
    queryFn: documentApi.getAllDocuments
  });

  const handleAddDocument = async (newDocument: DocumentType) => {
    const { data, error } = await supabase
      .from("document_types")
      .insert(newDocument)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add document",
        variant: "destructive",
      });
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['document-types'] });
  };

  const handleUpdateDocument = (id: string, field: keyof DocumentType, value: string | boolean) => {
    const updated = documentTypes.find(doc => doc.id === id);
    if (!updated) return;

    const updatedDoc = { ...updated, [field]: value };

    supabase.from("document_types").update(updatedDoc).eq("id", id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['document-types'] });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to update document",
          variant: "destructive",
        });
        console.error(error);
      });
  };

  const handleDeleteDocument = (id: string) => {
    supabase.from("document_types").delete().eq("id", id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['document-types'] });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive",
        });
        console.error(error);
      });
  };

  return {
    documentTypes,
    isLoading,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    refreshDocuments
  };
};
