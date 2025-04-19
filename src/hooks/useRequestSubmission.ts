
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
    const allFilesUploaded = Object.values(uploadedFiles).every(file => file !== null);
    
    if (!allFilesUploaded) {
      toast({
        variant: "destructive",
        title: "Missing Documents",
        description: "Please upload all required documents before submitting.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to submit a request.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the registration data
      const registrationData = {
        full_name: `${values.firstName} ${values.midName || ''} ${values.lastName}`,
        first_name: values.firstName,
        mid_name: values.midName || null,
        last_name: values.lastName,
        employee_id: values.employeeId,
        national_id: null, // You might want to add this field to the form
        insurance_number: values.insuranceNumber,
        position: values.position,
        area: values.area,
        sex: values.sex,
        request_type: values.requestType,
        company_id: values.companyId,
        company_name: null, // You'll need to fetch this based on companyId
        status: 'pending',
        user_id: user.id,
      };

      // Insert the registration request
      const { data, error } = await supabase
        .from('employee_registrations')
        .insert(registrationData)
        .select('id')
        .single();

      if (error) throw error;

      // Upload documents to Supabase storage (optional)
      const documentUploads = await Promise.all(
        Object.entries(uploadedFiles).map(async ([key, file]) => {
          if (!file) return null;
          const fileExt = file.name.split('.').pop();
          const fileName = `${data.id}_${key}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('employee-documents')
            .upload(fileName, file);
          
          return uploadError ? null : fileName;
        })
      );

      setRequestId(data.id);
      setIsCompleted(true);
      
      // Navigate to the print page with the new request ID
      navigate(`/print/${data.id}`);
      
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
