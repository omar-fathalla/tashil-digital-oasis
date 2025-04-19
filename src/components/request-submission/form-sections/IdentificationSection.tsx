
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";

interface IdentificationSectionProps {
  form: UseFormReturn<FormData>;
}

export const IdentificationSection = ({ form }: IdentificationSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employee ID / National ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter ID number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="insuranceNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insurance Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter insurance number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
