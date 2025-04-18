
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Image } from "lucide-react";

interface DocumentUploadsFormProps {
  uploadedFiles: {
    commercialRegister: File | null;
    taxCard: File | null;
  };
  onFileUpload: (type: 'commercialRegister' | 'taxCard', file: File) => void;
}

export function DocumentUploadsForm({ uploadedFiles, onFileUpload }: DocumentUploadsFormProps) {
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
              if (file) onFileUpload('commercialRegister', file);
            }}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('commercial-register')?.click()}
          >
            Select File
          </Button>
          {uploadedFiles.commercialRegister && (
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
              if (file) onFileUpload('taxCard', file);
            }}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('tax-card')?.click()}
          >
            Select File
          </Button>
          {uploadedFiles.taxCard && (
            <p className="mt-2 text-sm text-green-600">
              ✓ File uploaded: {uploadedFiles.taxCard.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
