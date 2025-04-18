
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";
import { useCallback } from "react";

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
  // Create separate handler functions with useCallback to avoid recreation on every render
  const handlePrevious = useCallback(() => {
    setFormStep(formStep - 1);
  }, [formStep, setFormStep]);
  
  const handleNext = useCallback(() => {
    if (formStep === 0) {
      form.trigger([
        'firstName', 'midName', 'lastName', 'employeeId', 
        'insuranceNumber', 'position', 'requestType', 
        'companyId', 'sex', 'area'
      ]);
      const isValid = !form.formState.errors.firstName && 
        !form.formState.errors.midName &&
        !form.formState.errors.lastName &&
        !form.formState.errors.employeeId && 
        !form.formState.errors.insuranceNumber && 
        !form.formState.errors.position && 
        !form.formState.errors.requestType &&
        !form.formState.errors.companyId &&
        !form.formState.errors.sex &&
        !form.formState.errors.area;
      if (isValid) setFormStep(1);
    } else {
      setFormStep(2);
    }
  }, [formStep, form, setFormStep]);
  
  const handleSubmit = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  return (
    <div className="flex justify-between">
      {formStep > 0 ? (
        <Button 
          variant="outline" 
          onClick={handlePrevious}
        >
          Previous
        </Button>
      ) : (
        <div></div>
      )}
      {formStep < 2 ? (
        <Button onClick={handleNext}>
          Next Step
        </Button>
      ) : (
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register Employee"}
        </Button>
      )}
    </div>
  );
};
