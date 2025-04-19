
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
  id: string;
  name: string;
  required: boolean;
  instructions: string;
}

export const DocumentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newDocument, setNewDocument] = useState<Omit<DocumentType, "id">>({
    name: "",
    required: true,
    instructions: "",
  });

  // Fetch document types from system_settings
  const { data = [], isLoading } = useQuery({
    queryKey: ['system-settings', 'document-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('category', 'documents')
        .eq('key', 'document_types')
        .single();

      if (error) {
        console.error('Error fetching document types:', error);
        return [] as DocumentType[];
      }
      
      // Parse value and ensure it's an array of DocumentType
      try {
        const typesData = data?.value;
        if (!typesData) return [] as DocumentType[];
        
        // If it's already an array, validate and return it
        if (Array.isArray(typesData)) {
          // Cast to DocumentType[] after validating structure
          const validDocuments: DocumentType[] = [];
          for (const item of typesData) {
            if (typeof item === 'object' && item !== null && 
                'id' in item && 'name' in item && 'required' in item) {
              validDocuments.push({
                id: String(item.id),
                name: String(item.name),
                required: Boolean(item.required),
                instructions: 'instructions' in item ? String(item.instructions) : ''
              });
            }
          }
          return validDocuments;
        }
        
        // Try to parse JSON string if needed
        if (typeof typesData === 'string') {
          try {
            const parsed = JSON.parse(typesData);
            if (Array.isArray(parsed)) {
              // Same validation as above
              const validDocuments: DocumentType[] = [];
              for (const item of parsed) {
                if (typeof item === 'object' && item !== null && 
                    'id' in item && 'name' in item && 'required' in item) {
                  validDocuments.push({
                    id: String(item.id),
                    name: String(item.name),
                    required: Boolean(item.required),
                    instructions: 'instructions' in item ? String(item.instructions) : ''
                  });
                }
              }
              return validDocuments;
            }
          } catch (e) {
            console.error('Failed to parse document data string:', e);
            return [] as DocumentType[];
          }
        }
        
        // Default fallback
        console.warn('Document data is neither an array nor a parsable string:', typesData);
        return [] as DocumentType[];
      } catch (e) {
        console.error('Error parsing document types:', e);
        return [] as DocumentType[];
      }
    }
  });

  // Make sure documentTypes is always an array
  const documentTypes = Array.isArray(data) ? data : [];

  // Update document types mutation
  const updateDocumentTypes = useMutation({
    mutationFn: async (newDocTypes: DocumentType[]) => {
      // Check that newDocTypes is an array
      if (!Array.isArray(newDocTypes)) {
        console.error("Expected array for document types update, got:", newDocTypes);
        throw new Error("Invalid document types data format");
      }
      
      const { data, error } = await supabase.rpc('update_setting', {
        p_category: 'documents',
        p_key: 'document_types',
        p_value: JSON.stringify(newDocTypes)
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings', 'document-types'] });
      toast({
        title: "Success",
        description: "Document types updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating document types:', error);
      toast({
        title: "Error",
        description: "Failed to update document types",
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

    // Create a new array with the existing documents and the new one
    const currentDocTypes = Array.isArray(documentTypes) ? documentTypes : [];
    const newDocTypes = [
      ...currentDocTypes,
      {
        id: Date.now().toString(),
        ...newDocument,
      },
    ];

    updateDocumentTypes.mutate(newDocTypes);
    setNewDocument({
      name: "",
      required: true,
      instructions: "",
    });
  };

  const handleRemoveDocument = (id: string) => {
    const currentDocTypes = Array.isArray(documentTypes) ? documentTypes : [];
    const newDocTypes = currentDocTypes.filter((doc) => doc.id !== id);
    updateDocumentTypes.mutate(newDocTypes);
  };

  const handleUpdateDocument = (id: string, field: keyof Omit<DocumentType, "id">, value: string | boolean) => {
    const currentDocTypes = Array.isArray(documentTypes) ? documentTypes : [];
    const newDocTypes = currentDocTypes.map((doc) =>
      doc.id === id ? { ...doc, [field]: value } : doc
    );
    updateDocumentTypes.mutate(newDocTypes);
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
        {documentTypes.map((doc) => (
          <Card key={doc.id} className="relative">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Document Name</label>
                  <Input
                    value={doc.name}
                    onChange={(e) => handleUpdateDocument(doc.id, "name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Required</label>
                  <div className="flex items-center mt-3">
                    <Switch
                      checked={doc.required}
                      onCheckedChange={(checked) => handleUpdateDocument(doc.id, "required", checked)}
                    />
                    <span className="ml-2 text-sm">
                      {doc.required ? "Required" : "Optional"}
                    </span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Instructions</label>
                  <Textarea
                    value={doc.instructions}
                    onChange={(e) => handleUpdateDocument(doc.id, "instructions", e.target.value)}
                    placeholder="Add specific instructions..."
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveDocument(doc.id)}
                className="absolute top-3 right-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
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
                value={newDocument.instructions}
                onChange={(e) => setNewDocument({ ...newDocument, instructions: e.target.value })}
                placeholder="Add specific instructions..."
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddDocument} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Add Document Type
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
