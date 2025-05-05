
import { useState } from "react";
import { UploadedFiles } from "./types";
import { PhotoUpload } from "./PhotoUpload";
import { DocumentLoadingState } from "./document-upload/LoadingState";
import { DocumentSection } from "./document-upload/DocumentSection";
import { useExistingDocuments } from "./document-upload/ExistingDocumentsLoader";

interface DocumentUploadProps {
  uploadedFiles: UploadedFiles;
  onFileUpload: (fileType: keyof UploadedFiles, file: File) => void;
  onPhotoUpload?: (url: string) => void;
  editMode?: boolean;
}

export const DocumentUpload = ({ 
  uploadedFiles, 
  onFileUpload,
  onPhotoUpload,
  editMode = false
}: DocumentUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDocuments, setExistingDocuments] = useState<Record<string, { url: string, verified: boolean }>>({});

  // Load existing documents if in edit mode
  useExistingDocuments({
    editMode,
    setExistingDocuments,
    setIsLoading,
    setError,
    onPhotoUpload
  });

  // Handle loading state and errors
  const loadingState = <DocumentLoadingState isLoading={isLoading} error={error} />;
  if (isLoading || error) return loadingState;

  return (
    <div className="space-y-6">
      {onPhotoUpload && (
        <PhotoUpload 
          onPhotoUpload={onPhotoUpload}
          existingPhotoUrl={existingDocuments.employeePhoto?.url} 
        />
      )}
      
      <DocumentSection
        title="ID / Passport Copy"
        description="Upload a copy of the employee's ID or passport"
        id="id-upload"
        fileType="idDocument"
        onFileChange={(file) => onFileUpload("idDocument", file)}
        currentFile={uploadedFiles.idDocument}
        existingDocument={existingDocuments.idDocument}
      />
      
      <DocumentSection
        title="Authorization Letter"
        description="Upload company authorization letter"
        id="auth-upload"
        fileType="authorizationLetter"
        onFileChange={(file) => onFileUpload("authorizationLetter", file)}
        currentFile={uploadedFiles.authorizationLetter}
        existingDocument={existingDocuments.authorizationLetter}
      />
      
      <DocumentSection
        title="Payment Receipt"
        description="Upload payment receipt for service fees"
        id="receipt-upload"
        fileType="paymentReceipt"
        onFileChange={(file) => onFileUpload("paymentReceipt", file)}
        currentFile={uploadedFiles.paymentReceipt}
        existingDocument={existingDocuments.paymentReceipt}
      />
      
      {!onPhotoUpload && (
        <DocumentSection
          title="Employee Photo"
          description="Upload employee photo (recent, passport-sized)"
          id="photo-upload"
          fileType="employeePhoto"
          onFileChange={(file) => onFileUpload("employeePhoto", file)}
          currentFile={uploadedFiles.employeePhoto}
          existingDocument={existingDocuments.employeePhoto}
        />
      )}
    </div>
  );
};
