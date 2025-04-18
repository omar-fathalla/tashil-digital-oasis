
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ProgressSteps } from "@/components/request-submission/ProgressSteps";
import { EmployeeForm } from "@/components/request-submission/EmployeeForm";
import { DocumentUpload } from "@/components/request-submission/DocumentUpload";
import { ReviewStep } from "@/components/request-submission/ReviewStep";
import { SuccessState } from "@/components/request-submission/SuccessState";
import { formSchema, type FormData, type UploadedFiles } from "@/components/request-submission/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const RequestSubmission = () => {
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
      employeeName: "",
      employeeId: "",
      nationality: "",
      position: "",
      requestType: "",
    },
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('application_documents')
      .upload(`${user.id}/${path}`, file);

    if (error) throw error;
    return data.path;
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
      const [idDocPath, authLetterPath, receiptPath, photoPath] = await Promise.all([
        uploadFile(uploadedFiles.idDocument!, `${values.employeeId}/id-document`),
        uploadFile(uploadedFiles.authorizationLetter!, `${values.employeeId}/auth-letter`),
        uploadFile(uploadedFiles.paymentReceipt!, `${values.employeeId}/payment-receipt`),
        uploadFile(uploadedFiles.employeePhoto!, `${values.employeeId}/photo`),
      ]);

      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          employee_name: values.employeeName,
          employee_id: values.employeeId,
          status: "under-review",
          type: values.requestType,
          notes: `Position: ${values.position}, Nationality: ${values.nationality}`,
          id_document_url: idDocPath,
          authorization_letter_url: authLetterPath,
          payment_receipt_url: receiptPath,
          employee_photo_url: photoPath,
        })
        .select()
        .single();

      if (error) throw error;

      setRequestId(data.id);
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

  const handleFileUpload = (fileType: keyof UploadedFiles, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  if (isCompleted) {
    return <SuccessState requestId={requestId} />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Request Submission
            </h1>
            <p className="text-lg text-gray-600">
              Submit a request for employee registration or other administrative services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ProgressSteps currentStep={formStep} />
            
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>
                  {formStep === 0 && "Employee Information"}
                  {formStep === 1 && "Required Documents"}
                  {formStep === 2 && "Review Request"}
                </CardTitle>
                <CardDescription>
                  {formStep === 0 && "Enter employee and request details"}
                  {formStep === 1 && "Upload the required documents"}
                  {formStep === 2 && "Verify all information before submission"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {formStep === 0 && <EmployeeForm form={form} />}
                    {formStep === 1 && (
                      <DocumentUpload
                        uploadedFiles={uploadedFiles}
                        onFileUpload={handleFileUpload}
                      />
                    )}
                    {formStep === 2 && (
                      <ReviewStep
                        formData={form.getValues()}
                        uploadedFiles={uploadedFiles}
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
                        form.trigger(['employeeName', 'employeeId', 'nationality', 'position', 'requestType']);
                        const isValid = !form.formState.errors.employeeName && 
                          !form.formState.errors.employeeId && 
                          !form.formState.errors.nationality && 
                          !form.formState.errors.position && 
                          !form.formState.errors.requestType;
                        if (isValid) setFormStep(1);
                      } else {
                        setFormStep(2);
                      }
                    }}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
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

export default RequestSubmission;
