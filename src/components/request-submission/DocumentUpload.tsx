
import { Upload, CheckCircle2, FileX, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";
import { PhotoUpload } from "./PhotoUpload";
import { UploadedFiles } from "./types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDocuments, setExistingDocuments] = useState<Record<string, { url: string, verified: boolean }>>({});

  useEffect(() => {
    // Only fetch existing documents in edit mode with an ID
    if (editMode && id) {
      const fetchDocuments = async () => {
        setIsLoading(true);
        try {
          // Check registration_requests documents field
          const { data: requestData, error: requestError } = await supabase
            .from('registration_requests')
            .select('documents')
            .eq('id', id)
            .single();

          if (requestError && !requestError.message.includes('not found')) {
            throw requestError;
          }

          const documents: Record<string, { url: string, verified: boolean }> = {};

          // Process documents from registration_requests
          if (requestData?.documents) {
            const requestDocs = requestData.documents;
            
            // Map registration_requests document fields to uploadedFiles keys
            const mappings: Record<string, keyof UploadedFiles> = {
              national_id_card: "idDocument",
              photo: "employeePhoto",
              work_permit: "authorizationLetter",
              insurance_card: "paymentReceipt"
            };

            // Add each document to our documents object
            Object.entries(mappings).forEach(([reqKey, uploadKey]) => {
              if (requestDocs[reqKey]) {
                documents[uploadKey as string] = {
                  url: requestDocs[reqKey],
                  verified: false // We don't have verification status for these
                };
              }
            });
          }

          setExistingDocuments(documents);
          
          // If we have a photo URL and onPhotoUpload handler, call it
          if (documents.employeePhoto && onPhotoUpload) {
            onPhotoUpload(documents.employeePhoto.url);
          }

        } catch (error) {
          console.error('Error fetching documents:', error);
          setError("Failed to load existing documents");
          toast.error("Failed to load existing documents");
        } finally {
          setIsLoading(false);
        }
      };

      fetchDocuments();
    }
  }, [editMode, id, onPhotoUpload]);

  const renderUploadSection = (
    title: string,
    description: string,
    id: string,
    fileType: keyof UploadedFiles
  ) => {
    // Check if we have an existing document for this type
    const existingDoc = existingDocuments[fileType];
    
    return (
      <div className="relative">
        <h3 className="font-medium mb-2 flex items-center">
          {title}
          {existingDoc && (
            <Badge 
              variant={existingDoc.verified ? "outline" : "secondary"} 
              className={`ml-2 ${existingDoc.verified ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
            >
              {existingDoc.verified ? (
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
        
        {existingDoc ? (
          // Show existing document with option to replace
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Document uploaded</span>
              </div>
              <a 
                href={existingDoc.url} 
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
                if (file) onFileUpload(fileType, file);
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
        )}
        
        {/* Show preview for newly uploaded files */}
        {uploadedFiles[fileType] && (
          <ImagePreview
            file={uploadedFiles[fileType]}
            label={`${title} Preview`}
          />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {onPhotoUpload && (
        <PhotoUpload 
          onPhotoUpload={onPhotoUpload}
          existingPhotoUrl={existingDocuments.employeePhoto?.url} 
        />
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
      {!onPhotoUpload && renderUploadSection(
        "Employee Photo",
        "Upload employee photo (recent, passport-sized)",
        "photo-upload",
        "employeePhoto"
      )}
    </div>
  );
};
