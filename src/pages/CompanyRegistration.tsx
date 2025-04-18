
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck } from "lucide-react";
import { companyRegistrationSchema, type CompanyRegistrationFormData } from "@/schemas/companyRegistration";
import { CompanyInformationForm } from "@/components/company-registration/CompanyInformationForm";
import { AccountAccessForm } from "@/components/company-registration/AccountAccessForm";
import { DocumentUploadsForm } from "@/components/company-registration/DocumentUploadsForm";
import { RegistrationSteps } from "@/components/company-registration/RegistrationSteps";

const CompanyRegistration = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    commercialRegister: null as File | null,
    taxCard: null as File | null,
  });
  
  const form = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
    defaultValues: {
      companyName: "",
      address: "",
      taxCardNumber: "",
      commercialRegisterNumber: "",
      companyNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: CompanyRegistrationFormData) => {
    setIsSubmitting(true);
    console.log("Form values:", values);
    console.log("Uploaded files:", uploadedFiles);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 1500);
  };

  const handleFileUpload = (type: 'commercialRegister' | 'taxCard', file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  if (isCompleted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-lg border-none shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
              <BadgeCheck className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription className="text-lg">
              تم تسجيل شركتك بنجاح في منصة تشيل
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              لقد اكتملت عملية التسجيل. يمكنك الآن الوصول إلى جميع خدمات المنصة
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary-700">
              <Link to="/dashboard">الذهاب إلى لوحة التحكم</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Company Registration</h1>
            <p className="text-lg text-gray-600">
              Register your company to access Tashil Platform's digital administrative services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <RegistrationSteps currentStep={formStep} />

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>
                  {formStep === 0 && "Company Information"}
                  {formStep === 1 && "Account Access"}
                  {formStep === 2 && "Required Documents"}
                </CardTitle>
                <CardDescription>
                  {formStep === 0 && "Enter your company's basic information"}
                  {formStep === 1 && "Set up your company's account credentials"}
                  {formStep === 2 && "Upload the required documents"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {formStep === 0 && <CompanyInformationForm form={form} />}
                    {formStep === 1 && <AccountAccessForm form={form} />}
                    {formStep === 2 && (
                      <DocumentUploadsForm
                        uploadedFiles={uploadedFiles}
                        onFileUpload={handleFileUpload}
                      />
                    )}
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {formStep > 0 ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setFormStep(formStep - 1)}
                  >
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                {formStep < 2 ? (
                  <Button 
                    onClick={() => {
                      if (formStep === 0) {
                        form.trigger(['companyName', 'address', 'taxCardNumber', 'commercialRegisterNumber', 'companyNumber']);
                        const isValid = !form.formState.errors.companyName && 
                                     !form.formState.errors.address && 
                                     !form.formState.errors.taxCardNumber && 
                                     !form.formState.errors.commercialRegisterNumber && 
                                     !form.formState.errors.companyNumber;
                        if (isValid) setFormStep(1);
                      } else if (formStep === 1) {
                        form.trigger(['username', 'password', 'confirmPassword']);
                        const isValid = !form.formState.errors.username && 
                                     !form.formState.errors.password && 
                                     !form.formState.errors.confirmPassword;
                        if (isValid) setFormStep(2);
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || !uploadedFiles.commercialRegister || !uploadedFiles.taxCard}
                  >
                    {isSubmitting ? "Submitting..." : "Complete Registration"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyRegistration;
