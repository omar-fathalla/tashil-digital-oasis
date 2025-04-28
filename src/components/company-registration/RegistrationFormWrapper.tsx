
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { CompanyRegistrationFormData } from "@/schemas/companyRegistration";

interface RegistrationFormWrapperProps {
  children: React.ReactNode;
  form: UseFormReturn<CompanyRegistrationFormData>;
  formStep: number;
  title: string;
  description: string;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: (values: CompanyRegistrationFormData) => void;
  showSubmit: boolean;
  disableSubmit?: boolean;
}

export function RegistrationFormWrapper({
  children,
  form,
  formStep,
  title,
  description,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
  showSubmit,
  disableSubmit,
}: RegistrationFormWrapperProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <Progress value={((formStep + 1) / 3) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Account</span>
            <span>Company</span>
            <span>Documents</span>
          </div>
        </div>

        {children}

        <div className="flex justify-between pt-4">
          {formStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {!showSubmit ? (
            <Button type="button" onClick={onNext} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting || disableSubmit}
            >
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
