
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, type FormData, type UploadedFiles } from "@/components/request-submission/types";

export const useRequestSubmission = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [requestId, setRequestId] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    idDocument: null,
    authorizationLetter: null,
    paymentReceipt: null,
    employeePhoto: null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: "",
      employeeId: "",
      nationality: "",
      position: "",
      requestType: "",
    },
  });

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('application_documents')
      .upload(`${user?.id}/${path}`, file);

    if (error) throw error;
    return data.path;
  };

  const handleFileUpload = (fileType: keyof UploadedFiles, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const onSubmit = async (values: FormData) => {
    const allFilesUploaded = Object.values(uploadedFiles).every(file => file !== null);
    
    if (!allFilesUploaded) {
      toast({
        variant: "destructive",
        title: "Missing Documents",
        description: "Please upload all required documents before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const [idDocPath, authLetterPath, receiptPath, photoPath] = await Promise.all([
        uploadFile(uploadedFiles.idDocument!, `${values.employeeId}/id-document`),
        uploadFile(uploadedFiles.authorizationLetter!, `${values.employeeId}/auth-letter`),
        uploadFile(uploadedFiles.paymentReceipt!, `${values.employeeId}/payment-receipt`),
        uploadFile(uploadedFiles.employeePhoto!, `${values.employeeId}/photo`),
      ]);

      const notesContent = `Position: ${values.position}, Nationality: ${values.nationality}`;
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          employee_name: values.employeeName,
          employee_id: values.employeeId,
          status: "under-review",
          type: values.requestType,
          notes: notesContent,
          user_id: user?.id,
          created_at: new Date().toISOString(),
          request_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setRequestId(data.id);
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formStep,
    setFormStep,
    isSubmitting,
    isCompleted,
    requestId,
    uploadedFiles,
    form,
    handleFileUpload,
    onSubmit,
    user,
  };
};
