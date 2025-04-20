
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/utils/documentApi";

interface DocumentFormProps {
  onAddDocument: (document: DocumentType) => Promise<void>;
}

export const DocumentForm = ({ onAddDocument }: DocumentFormProps) => {
  const { toast } = useToast();
  const [newDocument, setNewDocument] = useState<DocumentType>({
    name: "",
    required: true,
    instructions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDocument = async () => {
    if (!newDocument.name.trim()) {
      toast({
        title: "Error",
        description: "Document name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddDocument(newDocument);
      // Reset form after successful submission
      setNewDocument({
        name: "",
        required: true,
        instructions: "",
      });
    } catch (error) {
      console.error('Error adding document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            disabled={!newDocument.name.trim() || isSubmitting}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Document Type
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
