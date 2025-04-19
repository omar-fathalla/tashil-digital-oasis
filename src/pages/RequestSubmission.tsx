import { Form } from "@/components/ui/form";
import { ProgressSteps } from "@/components/request-submission/ProgressSteps";
import { EmployeeForm } from "@/components/request-submission/EmployeeForm";
import { DocumentUpload } from "@/components/request-submission/DocumentUpload";
import { ReviewStep } from "@/components/request-submission/ReviewStep";
import { SuccessState } from "@/components/request-submission/SuccessState";
import { RequestHeader } from "@/components/request-submission/RequestHeader";
import { FormNavigation } from "@/components/request-submission/FormNavigation";
import { FormCard } from "@/components/request-submission/FormCard";
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

  const getStepTitle = () => {
    switch (formStep) {
      case 0:
        return "Employee Information";
      case 1:
        return "Required Documents";
      case 2:
        return "Review Request";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (formStep) {
      case 0:
        return "Enter employee and request details";
      case 1:
        return "Upload the required documents";
      case 2:
        return "Verify all information before submission";
      default:
        return "";
    }
  };

  const handlePhotoUpload = (url: string) => {
    form.setValue('photoUrl', url);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <RequestHeader />
      
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ProgressSteps currentStep={formStep} />
            
            <FormCard
              title={getStepTitle()}
              description={getStepDescription()}
              footer={
                <FormNavigation
                  formStep={formStep}
                  setFormStep={setFormStep}
                  form={form}
                  isSubmitting={isSubmitting}
                  onSubmit={onSubmit}
                />
              }
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {formStep === 0 && <EmployeeForm form={form} />}
                  {formStep === 1 && (
                    <DocumentUpload
                      uploadedFiles={uploadedFiles}
                      onFileUpload={handleFileUpload}
                      onPhotoUpload={handlePhotoUpload}
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
            </FormCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestSubmission;
