
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";

interface FormNavigationProps {
  formStep: number;
  setFormStep: (step: number) => void;
  form: UseFormReturn<FormData>;
  isSubmitting: boolean;
  onSubmit: (values: FormData) => Promise<void>;
}

export const FormNavigation = ({
  formStep,
  setFormStep,
  form,
  isSubmitting,
  onSubmit,
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between">
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
    </div>
  );
};
