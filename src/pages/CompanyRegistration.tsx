
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { companyRegistrationSchema, type CompanyRegistrationFormData } from "@/schemas/companyRegistration";
import { CompanyInformationForm } from "@/components/company-registration/CompanyInformationForm";
import { AccountAccessForm } from "@/components/company-registration/AccountAccessForm";
import { DocumentUploadsForm } from "@/components/company-registration/DocumentUploadsForm";
import { CompanyRegistrationSuccess } from "@/components/company-registration/CompanyRegistrationSteps";
import { RegistrationFormWrapper } from "@/components/company-registration/RegistrationFormWrapper";

const CompanyRegistration = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    commercialRegister: null as File | null,
    taxCard: null as File | null,
  });
  const navigate = useNavigate();
  
  const form = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
    defaultValues: {
      companyName: "",
      address: "",
      taxCardNumber: "",
      registerNumber: "",
      companyNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: CompanyRegistrationFormData) => {
    try {
      setIsSubmitting(true);

      // 1. Upload documents to storage first
      let commercialRegisterUrl = null;
      let taxCardUrl = null;

      if (uploadedFiles.commercialRegister) {
        const timestamp = Date.now();
        const filePath = `company-documents/${timestamp}-${uploadedFiles.commercialRegister.name}`;
        const { error: commercialRegisterError } = await supabase.storage
          .from('company-documents')
          .upload(filePath, uploadedFiles.commercialRegister);

        if (commercialRegisterError) throw commercialRegisterError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('company-documents')
          .getPublicUrl(filePath);
        commercialRegisterUrl = publicUrl;
      }

      if (uploadedFiles.taxCard) {
        const timestamp = Date.now();
        const filePath = `company-documents/${timestamp}-${uploadedFiles.taxCard.name}`;
        const { error: taxCardError } = await supabase.storage
          .from('company-documents')
          .upload(filePath, uploadedFiles.taxCard);

        if (taxCardError) throw taxCardError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('company-documents')
          .getPublicUrl(filePath);
        taxCardUrl = publicUrl;
      }

      // 2. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${values.username}@tashil.com`,
        password: values.password,
      });

      if (authError) throw authError;

      // 3. Create company record after successful signup
      if (authData?.user) {
        // Wait a moment for the auth session to be established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create company record
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            company_name: values.companyName,
            address: values.address,
            tax_card_number: values.taxCardNumber,
            register_number: values.registerNumber,
            company_number: values.companyNumber,
            user_id: authData.user.id,
            commercial_register_url: commercialRegisterUrl,
            tax_card_url: taxCardUrl,
          });

        if (companyError) {
          console.error('Error inserting company record:', companyError);
          throw companyError;
        }
      }

      setIsCompleted(true);
      toast.success("Registration Successful", {
        description: "Your company account has been created successfully.",
      });

    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Registration Error", {
        description: "An error occurred while registering the company. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (type: 'commercialRegister' | 'taxCard', file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  if (isCompleted) {
    return <CompanyRegistrationSuccess onNavigateToDashboard={() => navigate('/dashboard')} />;
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return form.trigger(['companyName', 'address', 'taxCardNumber', 'registerNumber', 'companyNumber'])
          .then(isValid => {
            if (isValid) setFormStep(1);
          });
      case 1:
        return form.trigger(['username', 'password', 'confirmPassword'])
          .then(isValid => {
            if (isValid) setFormStep(2);
          });
      default:
        return Promise.resolve();
    }
  };

  const getStepContent = () => {
    switch (formStep) {
      case 0:
        return {
          title: "Company Information",
          description: "Enter your company's basic information",
          content: <CompanyInformationForm form={form} />
        };
      case 1:
        return {
          title: "Account Access",
          description: "Set up your company's account credentials",
          content: <AccountAccessForm form={form} />
        };
      case 2:
        return {
          title: "Required Documents",
          description: "Upload the required documents",
          content: (
            <DocumentUploadsForm
              uploadedFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
            />
          )
        };
      default:
        return {
          title: "",
          description: "",
          content: null
        };
    }
  };

  const { title, description, content } = getStepContent();

  return (
    <RegistrationFormWrapper
      form={form}
      formStep={formStep}
      title={title}
      description={description}
      isSubmitting={isSubmitting}
      onPrevious={() => setFormStep(formStep - 1)}
      onNext={() => validateStep(formStep)}
      onSubmit={onSubmit}
      showSubmit={formStep === 2}
      disableSubmit={!uploadedFiles.commercialRegister || !uploadedFiles.taxCard}
    >
      {content}
    </RegistrationFormWrapper>
  );
};

export default CompanyRegistration;
