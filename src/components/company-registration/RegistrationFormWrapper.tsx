
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RegistrationSteps } from "./RegistrationSteps";
import { CompanyRegistrationFormData } from "@/schemas/companyRegistration";

interface RegistrationFormWrapperProps {
  children: ReactNode;
  form: UseFormReturn<CompanyRegistrationFormData>;
  formStep: number;
  title: string;
  description: string;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: (values: CompanyRegistrationFormData) => Promise<void>;
  showSubmit?: boolean;
  disableSubmit?: boolean;
}

export const RegistrationFormWrapper = ({
  children,
  form,
  formStep,
  title,
  description,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
  showSubmit = false,
  disableSubmit = false,
}: RegistrationFormWrapperProps) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Company Registration
            </h1>
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
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {children}
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {formStep > 0 ? (
                  <Button variant="outline" onClick={onPrevious}>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                {!showSubmit ? (
                  <Button onClick={onNext}>Next</Button>
                ) : (
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || disableSubmit}
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
