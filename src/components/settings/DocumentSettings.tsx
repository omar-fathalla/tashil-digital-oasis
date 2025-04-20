
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DocumentType {
  id?: string;
  name: string;
  required: boolean;
  instructions?: string;
}

export const DocumentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newDocument, setNewDocument] = useState<DocumentType>({
    name: "",
    required: true,
    instructions: "",
  });

  // Fetch document types from the database
  const { data: documentTypes = [], isLoading } = useQuery({
    queryKey: ['document-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching document types:', error);
        return [];
      }
      
      return data as DocumentType[];
    }
  });

  // Mutation to add a new document type
  const addDocumentTypeMutation = useMutation({
    mutationFn: async (newDocType: DocumentType) => {
      const { data, error } = await supabase
        .from('document_types')
        .insert(newDocType)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newDocType) => {
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
      toast({
        title: "Document Type Added",
        description: `${newDocType.name} has been added successfully`,
      });
      // Reset the form
      setNewDocument({
        name: "",
        required: true,
        instructions: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add document type: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation to update a document type
  const updateDocumentTypeMutation = useMutation({
    mutationFn: async (updatedDocType: DocumentType) => {
      if (!updatedDocType.id) throw new Error("Document type ID is required");

      const { data, error } = await supabase
        .from('document_types')
        .update({
          name: updatedDocType.name,
          required: updatedDocType.required,
          instructions: updatedDocType.instructions
        })
        .eq('id', updatedDocType.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
      toast({
        title: "Document Type Updated",
        description: "Document type was successfully updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update document type: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation to delete a document type
  const deleteDocumentTypeMutation = useMutation({
    mutationFn: async (docTypeId: string) => {
      const { error } = await supabase
        .from('document_types')
        .delete()
        .eq('id', docTypeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
      toast({
        title: "Document Type Deleted",
        description: "Document type was successfully removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete document type: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleAddDocument = () => {
    if (!newDocument.name.trim()) {
      toast({
        title: "Error",
        description: "Document name is required",
        variant: "destructive",
      });
      return;
    }

    addDocumentTypeMutation.mutate(newDocument);
  };

  const handleUpdateDocument = (id: string, field: keyof DocumentType, value: string | boolean) => {
    const docToUpdate = { 
      id, 
      ...documentTypes.find(doc => doc.id === id),
      [field]: value 
    };
    updateDocumentTypeMutation.mutate(docToUpdate);
  };

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

      <div className="space-y-4">
        {documentTypes.length > 0 ? (
          documentTypes.map((doc) => (
            <Card key={doc.id} className="relative">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Document Name</label>
                    <Input
                      value={doc.name}
                      onChange={(e) => handleUpdateDocument(doc.id!, "name", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Required</label>
                    <div className="flex items-center mt-3">
                      <Switch
                        checked={doc.required}
                        onCheckedChange={(checked) => handleUpdateDocument(doc.id!, "required", checked)}
                      />
                      <span className="ml-2 text-sm">
                        {doc.required ? "Required" : "Optional"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Instructions</label>
                    <Textarea
                      value={doc.instructions || ''}
                      onChange={(e) => handleUpdateDocument(doc.id!, "instructions", e.target.value)}
                      placeholder="Add specific instructions..."
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDocumentTypeMutation.mutate(doc.id!)}
                  className="absolute top-3 right-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-muted-foreground">No document types found. Add one below.</div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Add New Document Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Document Name</label>
              <Input
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                placeholder="e.g., Work Permit"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Required</label>
              <div className="flex items-center mt-3">
                <Switch
                  checked={newDocument.required}
                  onCheckedChange={(checked) =>
                    setNewDocument({ ...newDocument, required: checked })
                  }
                />
                <span className="ml-2 text-sm">
                  {newDocument.required ? "Required" : "Optional"}
                </span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Instructions</label>
              <Textarea
                value={newDocument.instructions || ''}
                onChange={(e) => setNewDocument({ ...newDocument, instructions: e.target.value })}
                placeholder="Add specific instructions..."
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleAddDocument} 
              disabled={!newDocument.name.trim()}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Document Type
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
