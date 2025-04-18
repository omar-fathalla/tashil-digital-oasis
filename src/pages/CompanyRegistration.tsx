
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyRegistrationSchema } from '@/schemas/companyRegistration';
import { useToast } from '@/hooks/use-toast';

import { RegistrationSteps } from '@/components/company-registration/RegistrationSteps';
import { CompanyInformationForm } from '@/components/company-registration/CompanyInformationForm';
import { DocumentUploadsForm } from '@/components/company-registration/DocumentUploadsForm';
import { AccountAccessForm } from '@/components/company-registration/AccountAccessForm';

// Mock function to simulate form submission
const submitRegistration = async (data: any) => {
  // In a real app, this would submit to an API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Registration data:', data);
      resolve({ success: true });
    }, 1500);
  });
};

const CompanyRegistration = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(companyRegistrationSchema),
    defaultValues: {
      companyName: '',
      tradeLicense: '',
      companyType: '',
      businessActivity: '',
      address: '',
      phone: '',
      email: '',
      taxId: '',
      tradeLicenseFile: undefined,
      companyLogoFile: undefined,
      directorIdFile: undefined,
      taxDocumentFile: undefined,
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      adminTitle: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });
  
  const steps = [
    { title: 'Company Information', description: 'Basic company details' },
    { title: 'Documents Upload', description: 'Required legal documents' },
    { title: 'Account Access', description: 'Create admin credentials' }
  ];
  
  const handleNext = async () => {
    const fieldsToValidate = [];
    
    // Determine which fields to validate based on current step
    if (currentStep === 0) {
      fieldsToValidate.push(
        'companyName', 'tradeLicense', 'companyType', 
        'businessActivity', 'address', 'phone', 'email', 'taxId'
      );
    } else if (currentStep === 1) {
      fieldsToValidate.push(
        'tradeLicenseFile', 'companyLogoFile', 
        'directorIdFile', 'taxDocumentFile'
      );
    } else if (currentStep === 2) {
      fieldsToValidate.push(
        'adminName', 'adminEmail', 'adminPhone', 'adminTitle', 
        'password', 'confirmPassword', 'terms'
      );
    }
    
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit the form
        setIsSubmitting(true);
        try {
          const data = form.getValues();
          await submitRegistration(data);
          toast({
            title: "Registration Successful",
            description: "Your company registration has been submitted for review.",
          });
          form.reset();
          setCurrentStep(0);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.message || "There was an error submitting your registration.",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Company Registration</h1>
        
        <RegistrationSteps 
          steps={steps} 
          currentStep={currentStep} 
        />
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          {currentStep === 0 && (
            <CompanyInformationForm 
              form={form} 
              onNext={handleNext}
            />
          )}
          
          {currentStep === 1 && (
            <DocumentUploadsForm 
              form={form} 
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          
          {currentStep === 2 && (
            <AccountAccessForm 
              form={form} 
              onSubmit={handleNext}
              onPrevious={handlePrevious}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
