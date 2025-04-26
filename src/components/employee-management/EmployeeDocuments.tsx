
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeDocument, useEmployee } from "@/hooks/useEmployee";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface EmployeeDocumentsProps {
  documents: EmployeeDocument[];
  isLoading: boolean;
  employeeId?: string;
}

const EmployeeDocuments = ({ documents, isLoading, employeeId }: EmployeeDocumentsProps) => {
  const [uploading, setUploading] = useState(false);
  const { uploadDocument } = useEmployee(employeeId);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    uploadDocument.mutate(
      { file, documentType },
      {
        onSuccess: () => {
          toast.success(`${documentType} uploaded successfully`);
          setUploading(false);
        },
        onError: (error) => {
          toast.error(`Failed to upload ${documentType}`);
          console.error('Upload error:', error);
          setUploading(false);
        },
      }
    );
  };
  
  const documentTypes = [
    { type: 'id_card', label: 'ID Card' },
    { type: 'passport', label: 'Passport' },
    { type: 'resume', label: 'Resume/CV' },
    { type: 'contract', label: 'Employment Contract' },
    { type: 'certificate', label: 'Certificates' },
  ];
  
  const formatDocumentType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">No documents found for this employee</p>
            {employeeId && (
              <p className="text-sm text-muted-foreground mt-1">
                Upload documents using the options below
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {documents.map((document) => (
              <div 
                key={document.id} 
                className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted/10 p-2 rounded">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{formatDocumentType(document.document_type)}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {format(new Date(document.uploaded_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {document.verified ? (
                    <Badge className="bg-green-500 gap-1">
                      <Check className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <X className="h-3 w-3" />
                      Not Verified
                    </Badge>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(document.file_url, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {employeeId && (
          <>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Upload New Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((doc) => {
                  const existing = documents.find(d => d.document_type === doc.type);
                  
                  return (
                    <div key={doc.type} className="flex flex-col border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{doc.label}</span>
                        {existing && (
                          <Badge variant="outline" className="text-xs">Uploaded</Badge>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-3">
                        <label htmlFor={`upload-${doc.type}`}>
                          <div className="cursor-pointer">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="w-full gap-2"
                              disabled={uploading}
                            >
                              <Upload className="h-4 w-4" />
                              {existing ? 'Replace' : 'Upload'}
                            </Button>
                          </div>
                          <input 
                            type="file"
                            id={`upload-${doc.type}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, doc.type)}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, JPG, PNG. Maximum size: 5MB
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeDocuments;
