
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
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
      firstName: "",
      midName: "",
      lastName: "",
      employeeId: "",
      insuranceNumber: "",
      position: undefined,
      requestType: "",
      companyId: "",
      sex: undefined,
      area: undefined,
    },
  });

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
      // Mock API call - replace with real implementation
      const mockRequestId = crypto.randomUUID();
      
      setRequestId(mockRequestId);
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
