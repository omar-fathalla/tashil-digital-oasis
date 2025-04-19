
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
  const { data: rawData = [], isLoading } = useQuery({
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
      
      console.log("Raw document data from Supabase:", data?.value);
      
      // Handle the case when data.value is null or undefined
      if (!data?.value) {
        console.log("No document data found, returning empty array");
        return [] as DocumentType[];
      }

      // If data.value is already an array, verify and use it
      if (Array.isArray(data.value)) {
        return data.value.map(item => ({
          id: typeof item.id === 'string' ? item.id : String(item.id),
          name: typeof item.name === 'string' ? item.name : String(item.name),
          required: Boolean(item.required),
          instructions: typeof item.instructions === 'string' ? item.instructions : ''
        })) as DocumentType[];
      }
      
      // If data.value is a string, try to parse it
      if (typeof data.value === 'string') {
        try {
          const parsed = JSON.parse(data.value);
          if (Array.isArray(parsed)) {
            return parsed.map(item => ({
              id: typeof item.id === 'string' ? item.id : String(item.id),
              name: typeof item.name === 'string' ? item.name : String(item.name),
              required: Boolean(item.required),
              instructions: typeof item.instructions === 'string' ? item.instructions : ''
            })) as DocumentType[];
          }
        } catch (e) {
          console.error('Failed to parse document data string:', e);
        }
      }
      
      console.warn('Document data is not recognized as an array:', data.value);
      return [] as DocumentType[];
    }
  });

  // Ensure documentTypes is always a valid array
  const documentTypes = Array.isArray(rawData) ? rawData : [];
  
  console.log("Final document types array for rendering:", documentTypes);

  // Update document types mutation
  const updateDocumentTypes = useMutation({
    mutationFn: async (newDocTypes: DocumentType[]) => {
      // Ensure newDocTypes is an array
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
    const newDocTypes = [
      ...documentTypes,
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
    const newDocTypes = documentTypes.filter((doc) => doc.id !== id);
    updateDocumentTypes.mutate(newDocTypes);
  };

  const handleUpdateDocument = (id: string, field: keyof Omit<DocumentType, "id">, value: string | boolean) => {
    const newDocTypes = documentTypes.map((doc) =>
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
        {documentTypes.length > 0 ? (
          documentTypes.map((doc) => (
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
