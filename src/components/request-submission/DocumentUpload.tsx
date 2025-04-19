
import { Upload, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";
import { PhotoUpload } from "./PhotoUpload";
import { UploadedFiles } from "./types";

interface DocumentUploadProps {
  uploadedFiles: UploadedFiles;
  onFileUpload: (fileType: keyof UploadedFiles, file: File) => void;
  onPhotoUpload?: (url: string) => void;
}

export const DocumentUpload = ({ 
  uploadedFiles, 
  onFileUpload,
  onPhotoUpload 
}: DocumentUploadProps) => {
  const renderUploadSection = (
    title: string,
    description: string,
    id: string,
    fileType: keyof UploadedFiles
  ) => (
    <div>
      <h3 className="font-medium mb-2">{title}</h3>
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
            if (file) onFileUpload(fileType, file);
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
      <ImagePreview
        file={uploadedFiles[fileType]}
        label={`${title} Preview`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {onPhotoUpload && (
        <PhotoUpload onPhotoUpload={onPhotoUpload} />
      )}
      
      {renderUploadSection(
        "ID / Passport Copy",
        "Upload a copy of the employee's ID or passport",
        "id-upload",
        "idDocument"
      )}
      {renderUploadSection(
        "Authorization Letter",
        "Upload company authorization letter",
        "auth-upload",
        "authorizationLetter"
      )}
      {renderUploadSection(
        "Payment Receipt",
        "Upload payment receipt for service fees",
        "receipt-upload",
        "paymentReceipt"
      )}
      {renderUploadSection(
        "Employee Photo",
        "Upload employee photo (recent, passport-sized)",
        "photo-upload",
        "employeePhoto"
      )}
    </div>
  );
};
