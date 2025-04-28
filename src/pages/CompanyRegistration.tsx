
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { companyRegistrationSchema, type CompanyRegistrationFormData } from "@/schemas/companyRegistration";
import { CompanyInformationForm } from "@/components/company-registration/CompanyInformationForm";
import { DocumentUploadsForm } from "@/components/company-registration/DocumentUploadsForm";
import { CompanyRegistrationSuccess } from "@/components/company-registration/CompanyRegistrationSteps";
import { RegistrationFormWrapper } from "@/components/company-registration/RegistrationFormWrapper";
import { useAuth } from "@/components/AuthProvider";
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
  const { user } = useAuth(); // Get current authenticated user
  
  const form = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
    defaultValues: {
      companyName: "",
      address: "",
      taxCardNumber: "",
      registerNumber: "",
      companyNumber: "",
      // Username and password fields removed
    },
  });

  const onSubmit = async (values: CompanyRegistrationFormData) => {
    try {
      setIsSubmitting(true);

      if (!user) {
        toast.error("Authentication Error", {
          description: "You must be logged in to register a company.",
        });
        return;
      }

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

      // 2. Create company record directly linked to current authenticated user
      const { error: companyError } = await supabase
        .from('companies')
        .insert({
          company_name: values.companyName,
          address: values.address,
          tax_card_number: values.taxCardNumber,
          register_number: values.registerNumber,
          company_number: values.companyNumber,
          user_id: user.id,
          commercial_register_url: commercialRegisterUrl,
          tax_card_url: taxCardUrl,
        });

      if (companyError) {
        console.error('Error inserting company record:', companyError);
        throw companyError;
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
    return (
      <div className="container mx-auto px-4 py-8">
        <CompanyRegistrationSuccess onNavigateToDashboard={() => navigate('/dashboard')} />
      </div>
    );
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return form.trigger(['companyName', 'address', 'taxCardNumber', 'registerNumber', 'companyNumber'])
          .then(isValid => {
            if (isValid) setFormStep(1);
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
          Company Registration
        </h1>
        <p className="text-muted-foreground mt-2">
          Register your company and get started with our services
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
            showSubmit={formStep === 1}
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
