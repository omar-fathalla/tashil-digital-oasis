
import { FileUp, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadAreaProps {
  file: File | null;
  setFile: (file: File | null) => void;
  error?: string;
  onFileSelected?: (file: File) => void;
}

export function FileUploadArea({ 
  file, 
  setFile, 
  error,
  onFileSelected
}: FileUploadAreaProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Call the onFileSelected callback if provided
      if (onFileSelected) {
        onFileSelected(selectedFile);
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
        error ? "border-red-500" : "border-muted"
      }`}
      onClick={() => document.getElementById("file")?.click()}
    >
      <input
        type="file"
        id="file"
        className="hidden"
        onChange={handleFileChange}
      />
      {file ? (
        <div className="flex flex-col items-center">
          <FileUp className="h-10 w-10 text-green-500 mb-2" />
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
          >
            <X className="h-4 w-4 mr-1" /> Change File
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-muted-foreground">
            PDF, Word, Excel, Images, etc. (Max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}
