
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { companyRegistrationSchema, type CompanyRegistrationFormData } from "@/schemas/companyRegistration";
import { CompanyInformationForm } from "@/components/company-registration/CompanyInformationForm";
import { UserAccountForm } from "@/components/company-registration/UserAccountForm";
import { CompanyRegistrationSuccess } from "@/components/company-registration/CompanyRegistrationSteps";
import { RegistrationFormWrapper } from "@/components/company-registration/RegistrationFormWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useRetry } from "@/hooks/useRetry";
import { useFormDraft } from "@/hooks/useFormDraft";
import { mapPartialCompanyToInsertableCompany } from "@/utils/companyMapper";

const CompanyRegistration = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const { retry } = useRetry();
  
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

  const { clearDraft } = useFormDraft(form, 'company-registration', {
    excludeFields: ['password', 'confirmPassword'],
    saveInterval: 2000,
  });

  const onSubmit = async (values: CompanyRegistrationFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Starting registration transaction simulation...");

      // Step 1: Create the user account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            mobile_number: values.mobileNumber.replace(/[\s-]/g, ''),
          },
          emailRedirectTo: window.location.origin + '/auth',
        }
      });

      if (authError) {
        console.error('User registration error:', authError);
        if (authError.message.includes('already registered')) {
          throw new Error('This email is already registered. Please use a different email or try logging in.');
        }
        throw new Error(`Registration error: ${authError.message}`);
      }

      if (!authData.user?.id) {
        throw new Error("Failed to create user account");
      }

      // Log successful user creation
      console.log(`User created successfully with ID: ${authData.user.id}`);

      try {
        // Step 2: Create company record with the newly created user ID
        const companyData = {
          company_name: values.companyName,
          address: values.address,
          tax_card_number: values.taxCardNumber,
          register_number: values.registerNumber,
          company_number: values.companyNumber,
        };

        const insertableCompany = mapPartialCompanyToInsertableCompany(companyData, authData.user.id);

        const { error: companyError } = await supabase
          .from('companies')
          .insert(insertableCompany)
          .select()
          .single();

        if (companyError) {
          // Log company creation failure
          console.error("Company creation error:", companyError);
          
          // If company creation fails, we need to delete the user to maintain consistency
          // Note: This would typically be done with a server-side function as admin.deleteUser 
          // requires admin privileges. For now, we'll flag this in the UI.
          console.log(`Unable to automatically delete user ${authData.user.id} due to company creation failure - this requires server-side handling`);
          
          // Throw an error to stop the process and show a relevant message to the user
          throw new Error("Registration failed while creating company. Please contact support to complete your registration.");
        }

        // Registration successful
        console.log("Company created successfully, registration complete!");
        setIsCompleted(true);
        toast.success("Registration completed successfully!");
        
        // Clear the draft after successful registration
        clearDraft();

        // Redirect to About page after a short delay
        setTimeout(() => {
          navigate("/about");
        }, 2000);
      } catch (companyError: any) {
        // This catch block handles company creation errors
        console.error('Company creation process error:', companyError);
        
        toast.error("Registration failed", {
          description: companyError.message || "An error occurred during company registration."
        });
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      
      toast.error("Registration failed", {
        description: error.message || "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      default:
        return {
          title: "",
          description: "",
          content: null
        };
    }
  };

  const { title, description, content } = getStepContent();

  if (isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CompanyRegistrationSuccess onNavigateToDashboard={() => navigate('/auth')} />
      </div>
    );
  }

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
            showSubmit={formStep === 1}
          >
            {content}
          </RegistrationFormWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyRegistration;
