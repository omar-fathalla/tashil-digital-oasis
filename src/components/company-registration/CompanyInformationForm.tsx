
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CompanyRegistrationFormData } from "@/schemas/companyRegistration";

interface CompanyInformationFormProps {
  form: UseFormReturn<CompanyRegistrationFormData>;
}

export function CompanyInformationForm({ form }: CompanyInformationFormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter official company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Address</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter complete company address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="taxCardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax Card Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter 9-digit tax ID" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="registerNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commercial Register Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter 9-digit register number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="companyNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter Fathalla system company number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
