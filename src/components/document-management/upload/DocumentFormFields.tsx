
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentCategory } from "@/utils/documentApi";
import { FileUploadArea } from "./FileUploadArea";
import { KeywordsInput } from "./KeywordsInput";

interface DocumentFormFieldsProps {
  file: File | null;
  setFile: (file: File | null) => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  categoryId: string;
  setCategoryId: (categoryId: string) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  currentKeyword: string;
  setCurrentKeyword: (keyword: string) => void;
  isEncrypted: boolean;
  setIsEncrypted: (isEncrypted: boolean) => void;
  errors: Record<string, string>;
  categories: DocumentCategory[];
  onFileSelected?: (file: File) => void;
}

export function DocumentFormFields({
  file,
  setFile,
  name,
  setName,
  description,
  setDescription,
  categoryId,
  setCategoryId,
  keywords,
  setKeywords,
  currentKeyword,
  setCurrentKeyword,
  isEncrypted,
  setIsEncrypted,
  errors,
  categories,
  onFileSelected
}: DocumentFormFieldsProps) {
  return (
    <>
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file" className="text-sm font-medium">
          Document File{" "}
          <span className="text-red-500">*</span>
        </Label>
        <FileUploadArea 
          file={file} 
          setFile={setFile} 
          error={errors.file}
          onFileSelected={onFileSelected}
        />
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
        <KeywordsInput
          keywords={keywords}
          currentKeyword={currentKeyword}
          setKeywords={setKeywords}
          setCurrentKeyword={setCurrentKeyword}
        />
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
    </>
  );
}
