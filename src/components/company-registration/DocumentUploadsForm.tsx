
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Image } from "lucide-react";
import { useState } from "react";

interface DocumentUploadsFormProps {
  uploadedFiles: {
    commercialRegister: File | null;
    taxCard: File | null;
  };
  onFileUpload: (type: 'commercialRegister' | 'taxCard', file: File) => void;
}

export function DocumentUploadsForm({ uploadedFiles, onFileUpload }: DocumentUploadsFormProps) {
  const [errors, setErrors] = useState<{
    commercialRegister?: string;
    taxCard?: string;
  }>({});

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
    const error = validateFile(file);
    setErrors(prev => ({
      ...prev,
      [type]: error
    }));
    
    if (!error) {
      onFileUpload(type, file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Commercial Register File</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            Upload a digital copy of the Commercial Register
          </p>
          <p className="text-xs text-gray-400 mb-4">
            PDF or scanned image (max. 5MB)
          </p>
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
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('commercial-register')?.click()}
          >
            Select File
          </Button>
          {errors.commercialRegister && (
            <p className="mt-2 text-sm text-destructive">
              {errors.commercialRegister}
            </p>
          )}
          {uploadedFiles.commercialRegister && !errors.commercialRegister && (
            <p className="mt-2 text-sm text-green-600">
              ✓ File uploaded: {uploadedFiles.commercialRegister.name}
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Tax Card Image</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Image className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            Upload a clear image of the Tax Card
          </p>
          <p className="text-xs text-gray-400 mb-4">
            JPG, PNG or PDF (max. 5MB)
          </p>
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
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('tax-card')?.click()}
          >
            Select File
          </Button>
          {errors.taxCard && (
            <p className="mt-2 text-sm text-destructive">
              {errors.taxCard}
            </p>
          )}
          {uploadedFiles.taxCard && !errors.taxCard && (
            <p className="mt-2 text-sm text-green-600">
              ✓ File uploaded: {uploadedFiles.taxCard.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
