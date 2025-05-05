
import { useState } from "react";
import { DocumentCategory } from "@/utils/document"; // Updated import
import { useDocuments } from "@/hooks/useDocuments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { DocumentFormFields } from "./upload/DocumentFormFields";

interface DocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: DocumentCategory[];
}

export function DocumentUpload({
  open,
  onOpenChange,
  categories,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { uploadDocument } = useDocuments();

  const handleFileSelected = (selectedFile: File) => {
    // Auto-populate name from filename if not already set
    if (!name) {
      const fileName = selectedFile.name;
      // Remove extension
      const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
      setName(nameWithoutExtension || fileName);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!file) {
      newErrors.file = "Please select a file to upload";
    }
    
    if (!name.trim()) {
      newErrors.name = "Document name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await uploadDocument({
        file: file!,
        name,
        description: description || undefined,
        categoryId: categoryId || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        isEncrypted,
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setName("");
    setDescription("");
    setCategoryId("");
    setKeywords([]);
    setCurrentKeyword("");
    setIsEncrypted(false);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to the repository
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <DocumentFormFields 
            file={file}
            setFile={setFile}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            keywords={keywords}
            setKeywords={setKeywords}
            currentKeyword={currentKeyword}
            setCurrentKeyword={setCurrentKeyword}
            isEncrypted={isEncrypted}
            setIsEncrypted={setIsEncrypted}
            errors={errors}
            categories={categories}
            onFileSelected={handleFileSelected}
          />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isSubmitting ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
