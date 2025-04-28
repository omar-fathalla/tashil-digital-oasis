import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { companyRegistrationSchema, type CompanyRegistrationFormData } from "@/schemas/companyRegistration";
import { CompanyInformationForm } from "@/components/company-registration/CompanyInformationForm";
import { UserAccountForm } from "@/components/company-registration/UserAccountForm";
import { DocumentUploadsForm } from "@/components/company-registration/DocumentUploadsForm";
import { CompanyRegistrationSuccess } from "@/components/company-registration/CompanyRegistrationSteps";
import { RegistrationFormWrapper } from "@/components/company-registration/RegistrationFormWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

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
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
      companyName: "",
      address: "",
      taxCardNumber: "",
      registerNumber: "",
      companyNumber: "",
    },
  });

  const uploadFile = async (file: File, prefix: string): Promise<string | null> => {
    try {
      const timestamp = Date.now();
      const filePath = `company-documents/${prefix}-${timestamp}-${file.name}`;
      
      const { error } = await supabase.storage
        .from('company-documents')
        .upload(filePath, file);

      if (error) {
        console.error(`Error uploading ${prefix} file:`, error);
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('company-documents')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error(`Failed to upload ${prefix} file:`, error);
      return null;
    }
  };

  const validateFiles = (): boolean => {
    if (!uploadedFiles.commercialRegister) {
      toast.error("Missing Commercial Register Document", {
        description: "Please upload a copy of your Commercial Register."
      });
      return false;
    }
    
    if (!uploadedFiles.taxCard) {
      toast.error("Missing Tax Card Document", {
        description: "Please upload a copy of your Tax Card."
      });
      return false;
    }
    
    return true;
  };

  const onSubmit = async (values: CompanyRegistrationFormData) => {
    try {
      if (!validateFiles()) {
        return;
      }

      setIsSubmitting(true);
      toast.info("Processing registration...");

      // Step 1: Register the user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            mobile_number: values.mobileNumber.replace(/[\s-]/g, ''), // Normalize before saving
          },
          emailRedirectTo: window.location.origin + '/auth',
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('This email is already registered. Please use a different email or try logging in.');
        }
        throw new Error(`Registration error: ${authError.message}`);
      }

      if (!authData.user?.id) {
        throw new Error("Failed to create user account");
      }

      // Step 2: Upload the documents
      const commercialRegisterUrl = uploadedFiles.commercialRegister 
        ? await uploadFile(uploadedFiles.commercialRegister, "cr")
        : null;
      if (!commercialRegisterUrl) {
        throw new Error("Failed to upload Commercial Register document");
      }

      const taxCardUrl = uploadedFiles.taxCard 
        ? await uploadFile(uploadedFiles.taxCard, "tc")
        : null;
      if (!taxCardUrl) {
        throw new Error("Failed to upload Tax Card document");
      }

      // Step 3: Create the company record with the user_id from auth
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
        console.error("Company creation error:", companyError);
        throw new Error(`Failed to create company: ${companyError.message}`);
      }

      setIsCompleted(true);
      toast.success("Registration Successful", {
        description: "Please check your email to verify your account before logging in.",
      });

      navigate("/auth", { 
        state: { 
          justRegistered: true,
          requiresEmailVerification: true
        }
      });

    } catch (error: any) {
      console.error('Error during registration:', error);
      toast.error("Registration Failed", {
        description: error.message || "An error occurred while registering. Please try again.",
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
    return (
      <div className="container mx-auto px-4 py-8">
        <CompanyRegistrationSuccess onNavigateToDashboard={() => navigate('/auth')} />
      </div>
    );
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return form.trigger(['email', 'username', 'password', 'confirmPassword', 'mobileNumber'])
          .then(isValid => {
            if (isValid) setFormStep(1);
          });
      case 1:
        return form.trigger(['companyName', 'address', 'taxCardNumber', 'registerNumber', 'companyNumber'])
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
          title: "Account Information",
          description: "Create your account to get started",
          content: <UserAccountForm form={form} />
        };
      case 1:
        return {
          title: "Company Information",
          description: "Enter your company's basic information",
          content: <CompanyInformationForm form={form} />
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          Company & User Registration
        </h1>
        <p className="text-muted-foreground mt-2">
          Register your account and company to get started with our services
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyRegistration;
