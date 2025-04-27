
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/utils/documentApi";
import { supabase } from "@/integrations/supabase/client";

export const useDocumentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documentTypes = [], isLoading, refetch: refreshDocuments } = useQuery({
    queryKey: ['document-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_types")
        .select("*")
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  const handleAddDocument = async (newDocument: DocumentType) => {
    const safeDocument = {
      name: newDocument.name,
      required: newDocument.required ?? true,
      instructions: newDocument.instructions ?? null,
    };

    try {
      const { data, error } = await supabase
        .from("document_types")
        .insert(safeDocument)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add document",
          variant: "destructive",
        });
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['document-types'] });

      toast({
        title: "Success",
        description: "Document type added successfully",
      });

      // Return void to match the expected return type
      return;
    } catch (error) {
      console.error('Failed to add document:', error);
      throw error;
    }
  };

  const handleUpdateDocument = async (id: string, field: keyof DocumentType, value: string | boolean) => {
    const updatedDoc = { [field]: value };

    try {
      await supabase.from("document_types").update(updatedDoc).eq("id", id);
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await supabase.from("document_types").delete().eq("id", id);
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
      console.error(error);
    }
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
