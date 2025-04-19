
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
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
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to submit a request.",
      });
      return;
    }

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
      // Upload employee photo to Supabase storage
      let photoUrl = null;
      if (uploadedFiles.employeePhoto) {
        const fileName = `${Date.now()}_${uploadedFiles.employeePhoto.name}`;
        const { error: uploadError } = await supabase.storage
          .from('employee-documents')
          .upload(fileName, uploadedFiles.employeePhoto);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('employee-documents')
          .getPublicUrl(fileName);
          
        photoUrl = publicUrl;
      }

      // Prepare the registration data
      const registrationData = {
        full_name: `${values.firstName} ${values.midName || ''} ${values.lastName}`.trim(),
        first_name: values.firstName,
        mid_name: values.midName || null,
        last_name: values.lastName,
        employee_id: values.employeeId,
        insurance_number: values.insuranceNumber,
        position: values.position,
        area: values.area,
        sex: values.sex,
        request_type: values.requestType,
        company_id: values.companyId,
        user_id: user.id,
        photo_url: photoUrl,
      };

      // Insert the registration data
      const { data, error } = await supabase
        .from('employee_registrations')
        .insert(registrationData)
        .select()
        .single();

      if (error) throw error;

      setRequestId(data.id);
      setIsCompleted(true);
      
      // Navigate to the print page with the registration ID
      navigate(`/print/${data.id}`);
      
      toast({
        title: "Registration Successful",
        description: "Your employee registration has been submitted.",
      });
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
