import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentApi, DocumentType } from "@/utils/documentApi";

export const DocumentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newDocument, setNewDocument] = useState<DocumentType>({
    name: "",
    required: true,
    instructions: "",
  });

  // Fetch document types using the new API
  const { data: documentTypes = [], isLoading } = useQuery({
    queryKey: ['document-types'],
    queryFn: documentApi.getAllDocuments
  });

  // Mutation to save document types using the new API
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

  const handleAddDocument = () => {
    if (!newDocument.name.trim()) {
      toast({
        title: "Error",
        description: "Document name is required",
        variant: "destructive",
      });
      return;
    }

    const updatedDocuments = [...documentTypes, newDocument];
    saveDocumentTypesMutation.mutate(updatedDocuments);
    
    // Reset form
    setNewDocument({
      name: "",
      required: true,
      instructions: "",
    });
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
                  onClick={() => handleDeleteDocument(doc.id!)}
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
