
import { useState } from "react";
import { DocumentCategory } from "@/utils/documentApi";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Upload, FileUp, Plus } from "lucide-react";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      // Auto-populate name from filename if not already set
      if (!name) {
        const fileName = e.target.files[0].name;
        // Remove extension
        const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
        setName(nameWithoutExtension || fileName);
      }
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentKeyword.trim()) {
      e.preventDefault();
      addKeyword();
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
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              Document File{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div 
              className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
                errors.file ? "border-red-500" : "border-muted"
              }`}
              onClick={() => document.getElementById("file")?.click()}
            >
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <FileUp className="h-10 w-10 text-green-500 mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Change File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">
                    PDF, Word, Excel, Images, etc. (Max 10MB)
                  </p>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file}</p>
            )}
          </div>

          {/* Document Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Document Name{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Document Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this document (optional)"
              rows={3}
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm font-medium">
              Keywords
            </Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                placeholder="Enter keywords for search"
                onKeyPress={handleKeywordKeyPress}
              />
              <Button 
                type="button" 
                onClick={addKeyword}
                disabled={!currentKeyword.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                    <button
                      type="button"
                      className="ml-1"
                      onClick={() => removeKeyword(keyword)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Encryption Switch */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="encryption" className="text-sm font-medium">
                Enable Encryption
              </Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to this document
              </p>
            </div>
            <Switch
              id="encryption"
              checked={isEncrypted}
              onCheckedChange={setIsEncrypted}
            />
          </div>

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
