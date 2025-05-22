
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Image, AlertCircle, Trash2, FileCheck, Loader } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadsFormProps {
  uploadedFiles: {
    commercialRegister: File | null;
    taxCard: File | null;
  };
  onFileUpload: (type: 'commercialRegister' | 'taxCard', file: File) => void;
}

interface FileUploadState {
  error?: string;
  progress: number;
  loading: boolean;
  preview?: string;
}

export function DocumentUploadsForm({ uploadedFiles, onFileUpload }: DocumentUploadsFormProps) {
  const [fileStates, setFileStates] = useState<{
    commercialRegister: FileUploadState;
    taxCard: FileUploadState;
  }>({
    commercialRegister: { progress: 0, loading: false },
    taxCard: { progress: 0, loading: false },
  });

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'File must be PDF, JPG, or PNG';
    }
    
    return null;
  };

  const handleFileChange = (type: 'commercialRegister' | 'taxCard', file: File) => {
    // Reset state
    setFileStates(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true, progress: 0 }
    }));
    
    // Validate the file
    const error = validateFile(file);
    
    if (error) {
      setFileStates(prev => ({
        ...prev,
        [type]: { ...prev[type], error, loading: false }
      }));
      return;
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFileStates(prev => ({
        ...prev,
        [type]: { ...prev[type], progress: progress <= 100 ? progress : 100 }
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Create a preview for the file if it's an image
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFileStates(prev => ({
              ...prev,
              [type]: { 
                ...prev[type], 
                loading: false,
                preview: e.target?.result as string 
              }
            }));
          };
          reader.readAsDataURL(file);
        } else {
          setFileStates(prev => ({
            ...prev,
            [type]: { ...prev[type], loading: false }
          }));
        }
        
        // Call the parent component's upload handler
        onFileUpload(type, file);
      }
    }, 100);
  };

  const removeFile = (type: 'commercialRegister' | 'taxCard') => {
    onFileUpload(type, null as any);
    setFileStates(prev => ({
      ...prev,
      [type]: { progress: 0, loading: false }
    }));
  };

  return (
    <div className="space-y-6">
      {(!uploadedFiles.commercialRegister && !uploadedFiles.taxCard) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Both Commercial Register and Tax Card documents are required to complete registration.
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-2">Commercial Register File</h3>
        {uploadedFiles.commercialRegister && !fileStates.commercialRegister.loading ? (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
                <span className="font-medium">{uploadedFiles.commercialRegister.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {(uploadedFiles.commercialRegister.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => removeFile('commercialRegister')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {fileStates.commercialRegister.preview && (
              <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                <img 
                  src={fileStates.commercialRegister.preview} 
                  alt="Document preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('commercial-register')?.click()}
              >
                Replace File
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {fileStates.commercialRegister.loading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Loader className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="text-sm text-gray-500">Processing document...</p>
                <Progress value={fileStates.commercialRegister.progress} className="h-2" />
              </div>
            ) : (
              <>
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Upload a digital copy of the Commercial Register
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  PDF or scanned image (max. 5MB)
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('commercial-register')?.click()}
                >
                  Select File
                </Button>
              </>
            )}
          </div>
        )}
        <Input
          type="file"
          id="commercial-register"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange('commercialRegister', file);
          }}
        />
        {fileStates.commercialRegister.error && (
          <p className="mt-2 text-sm text-destructive">
            {fileStates.commercialRegister.error}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Tax Card Image</h3>
        {uploadedFiles.taxCard && !fileStates.taxCard.loading ? (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
                <span className="font-medium">{uploadedFiles.taxCard.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {(uploadedFiles.taxCard.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => removeFile('taxCard')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {fileStates.taxCard.preview && (
              <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                <img 
                  src={fileStates.taxCard.preview} 
                  alt="Document preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('tax-card')?.click()}
              >
                Replace File
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {fileStates.taxCard.loading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Loader className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="text-sm text-gray-500">Processing document...</p>
                <Progress value={fileStates.taxCard.progress} className="h-2" />
              </div>
            ) : (
              <>
                <Image className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Upload a clear image of the Tax Card
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  JPG, PNG or PDF (max. 5MB)
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('tax-card')?.click()}
                >
                  Select File
                </Button>
              </>
            )}
          </div>
        )}
        <Input
          type="file"
          id="tax-card"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange('taxCard', file);
          }}
        />
        {fileStates.taxCard.error && (
          <p className="mt-2 text-sm text-destructive">
            {fileStates.taxCard.error}
          </p>
        )}
      </div>
    </div>
  );
}
