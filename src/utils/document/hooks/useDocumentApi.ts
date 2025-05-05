
import { useToast } from "@/hooks/use-toast";
import { documentApi } from "../api";
import { Document } from "../types";

// Export a hook to use for document management API
export const useDocumentApi = () => {
  const { toast } = useToast();
  
  return {
    ...documentApi,
    uploadWithProgress: async (
      file: File,
      name: string,
      description?: string,
      categoryId?: string,
      keywords?: string[],
      isEncrypted: boolean = false
    ): Promise<Document> => {
      try {
        toast({
          title: 'Uploading document...',
          description: `${name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        });
        
        const result = await documentApi.uploadDocument(
          file, 
          name, 
          description, 
          categoryId, 
          keywords,
          isEncrypted
        );
        
        toast({
          title: 'Upload complete',
          description: `${name} has been uploaded successfully.`,
        });
        
        return result;
      } catch (error: any) {
        toast({
          title: 'Upload failed',
          description: error.message || 'Failed to upload document',
          variant: 'destructive',
        });
        throw error;
      }
    }
  };
};
