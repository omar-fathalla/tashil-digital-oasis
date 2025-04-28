
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

  const onSubmit = async (values: CompanyRegistrationFormData) => {
    try {
      setIsSubmitting(true);

      // First, register the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            mobile_number: values.mobileNumber,
          },
          emailRedirectTo: window.location.origin + '/auth',
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Upload documents to storage first
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

      // Then create the company profile
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

      if (companyError) throw companyError;

      setIsCompleted(true);
      toast.success("Registration Successful", {
        description: "Your account has been created. Please check your email for verification.",
      });

      // Redirect to auth page with notification about email verification
      navigate("/auth", { 
        state: { 
          justRegistered: true 
        }
      });

    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Registration Error", {
        description: "An error occurred while registering. Please try again.",
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
