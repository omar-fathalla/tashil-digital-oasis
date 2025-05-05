
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UploadedFiles } from "../types";
import { toast } from "sonner";

interface ExistingDocumentsLoaderProps {
  editMode: boolean;
  setExistingDocuments: (docs: Record<string, { url: string, verified: boolean }>) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onPhotoUpload?: (url: string) => void;
}

export const useExistingDocuments = ({
  editMode,
  setExistingDocuments,
  setIsLoading,
  setError,
  onPhotoUpload
}: ExistingDocumentsLoaderProps) => {
  const { id } = useParams();
  
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
  }, [editMode, id, onPhotoUpload, setExistingDocuments, setIsLoading, setError]);
};
