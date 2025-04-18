
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";

interface EmployeeFormProps {
  form: UseFormReturn<FormData>;
}

export const EmployeeForm = ({ form }: EmployeeFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="employeeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employee Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter employee name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nationality</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="saudi">Saudi Arabia</SelectItem>
                <SelectItem value="uae">United Arab Emirates</SelectItem>
                <SelectItem value="egypt">Egypt</SelectItem>
                <SelectItem value="jordan">Jordan</SelectItem>
                <SelectItem value="lebanon">Lebanon</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Position</FormLabel>
            <FormControl>
              <Input placeholder="Enter job position" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="requestType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Request Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new-registration">New Employee Registration</SelectItem>
                <SelectItem value="id-renewal">ID Renewal</SelectItem>
                <SelectItem value="information-update">Information Update</SelectItem>
                <SelectItem value="employment-termination">Employment Termination</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
