
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ProgressSteps } from "@/components/request-submission/ProgressSteps";
import { EmployeeForm } from "@/components/request-submission/EmployeeForm";
import { DocumentUpload } from "@/components/request-submission/DocumentUpload";
import { ReviewStep } from "@/components/request-submission/ReviewStep";
import { SuccessState } from "@/components/request-submission/SuccessState";
import { RequestHeader } from "@/components/request-submission/RequestHeader";
import { FormNavigation } from "@/components/request-submission/FormNavigation";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";
import { useNavigate } from "react-router-dom";

const RequestSubmission = () => {
  const {
    formStep,
    setFormStep,
    isSubmitting,
    isCompleted,
    requestId,
    uploadedFiles,
    form,
    handleFileUpload,
    onSubmit,
    user
  } = useRequestSubmission();
  
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isCompleted) {
    return <SuccessState requestId={requestId} />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <RequestHeader />
      
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
              <CardFooter>
                <FormNavigation
                  formStep={formStep}
                  setFormStep={setFormStep}
                  form={form}
                  isSubmitting={isSubmitting}
                  onSubmit={onSubmit}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestSubmission;
