import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentType } from "@/utils/documentApi";

interface DocumentListProps {
  documents: DocumentType[];
  onUpdateDocument: (id: string, field: keyof DocumentType, value: string | boolean) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentList = ({ 
  documents, 
  onUpdateDocument, 
  onDeleteDocument 
}: DocumentListProps) => {
  if (!documents.length) {
    return (
      <div className="text-muted-foreground">No document types found. Add one below.</div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="relative">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Document Name</label>
                <Input
                  value={doc.name}
                  onChange={(e) => onUpdateDocument(doc.id!, "name", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Required</label>
                <div className="flex items-center mt-3">
                  <Switch
                    checked={doc.required}
                    onCheckedChange={(checked) => onUpdateDocument(doc.id!, "required", checked)}
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
                  onChange={(e) => onUpdateDocument(doc.id!, "instructions", e.target.value)}
                  placeholder="Add specific instructions..."
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteDocument(doc.id!)}
              className="absolute top-3 right-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
