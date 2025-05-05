
import { Upload, CheckCircle2, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "../ImagePreview";
import { Badge } from "@/components/ui/badge";

interface DocumentSectionProps {
  title: string;
  description: string;
  id: string;
  fileType: string;
  onFileChange: (file: File) => void;
  currentFile: File | null;
  existingDocument?: {
    url: string;
    verified: boolean;
  };
}

export const DocumentSection = ({
  title,
  description,
  id,
  fileType,
  onFileChange,
  currentFile,
  existingDocument,
}: DocumentSectionProps) => {
  return (
    <div className="relative">
      <h3 className="font-medium mb-2 flex items-center">
        {title}
        {existingDocument && (
          <Badge 
            variant={existingDocument.verified ? "outline" : "secondary"} 
            className={`ml-2 ${existingDocument.verified ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
          >
            {existingDocument.verified ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <FileQuestion className="h-3 w-3" /> Pending Verification
              </span>
            )}
          </Badge>
        )}
      </h3>
      
      {existingDocument ? (
        // Show existing document with option to replace
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Document uploaded</span>
            </div>
            <a 
              href={existingDocument.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm underline"
            >
              View Document
            </a>
          </div>
          
          <Input
            type="file"
            className="hidden"
            id={id}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileChange(file);
            }}
          />
          <Button
            variant="outline"
            className="text-sm w-full"
            onClick={() => document.getElementById(id)?.click()}
          >
            Replace Document
          </Button>
        </div>
      ) : (
        // Show upload interface
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">{description}</p>
          <p className="text-xs text-gray-400 mb-4">PDF, JPG, or PNG (max. 5MB)</p>
          <Input
            type="file"
            className="hidden"
            id={id}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileChange(file);
            }}
          />
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => document.getElementById(id)?.click()}
          >
            Select File
          </Button>
        </div>
      )}
      
      {/* Show preview for newly uploaded files */}
      {currentFile && (
        <ImagePreview
          file={currentFile}
          label={`${title} Preview`}
        />
      )}
    </div>
  );
};
