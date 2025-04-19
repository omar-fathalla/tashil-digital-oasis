
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploadProps {
  onPhotoUpload: (url: string) => void;
}

export const PhotoUpload = ({ onPhotoUpload }: PhotoUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    hasFace?: boolean;
    quality?: { hasWhiteBackground?: boolean; isHighQuality?: boolean };
  }>({});
  const { toast } = useToast();

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file"
      });
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);

    // Validate photo
    setIsValidating(true);
    try {
      const response = await fetch('/api/validate-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview })
      });
      
      const results = await response.json();
      setValidationResults(results);

      if (!results.hasFace) {
        toast({
          variant: "default",
          title: "No face detected",
          description: "Please upload a clear photo with a visible face"
        });
        return;
      }

      if (!results.quality?.hasWhiteBackground) {
        toast({
          variant: "default",
          title: "Background check",
          description: "Please use a photo with a white background"
        });
      }

      if (!results.quality?.isHighQuality) {
        toast({
          variant: "default",
          title: "Image quality",
          description: "The image quality seems low. Consider uploading a higher quality photo"
        });
      }

      // Upload to Supabase storage
      const filePath = `personal-photos/${Date.now()}_${selectedFile.name}`;
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, selectedFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(filePath);

      onPhotoUpload(publicUrl);
      
      toast({
        title: "Photo uploaded successfully",
        description: "Your photo has been validated and uploaded"
      });

    } catch (error) {
      console.error('Validation error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your photo"
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">Personal Photo Upload</h3>
          <p className="text-sm text-muted-foreground">
            Upload a clear photo with a white background
          </p>
        </div>
        {validationResults.hasFace && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) handleFileSelect(droppedFile);
            }}
          >
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile);
              }}
            />
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop your photo here or
            </p>
            <Button
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
              disabled={isValidating}
            >
              Select File
            </Button>
          </div>
        </div>

        {preview && (
          <div className="col-span-1">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={preview}
                alt="Photo preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {Object.keys(validationResults).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Validation Results:</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              {validationResults.hasFace ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              Face Detection
            </li>
            {validationResults.quality && (
              <>
                <li className="flex items-center gap-2">
                  {validationResults.quality.hasWhiteBackground ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  White Background
                </li>
                <li className="flex items-center gap-2">
                  {validationResults.quality.isHighQuality ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  Image Quality
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </Card>
  );
};
