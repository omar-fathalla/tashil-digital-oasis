
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";
import { Label } from "@/components/ui/label";

interface EmployeeFormProps {
  form: UseFormReturn<FormData>;
}

export const EmployeeForm = ({ form }: EmployeeFormProps) => {
  const mockCompanies = [
    { id: "1", name: "Company A" },
    { id: "2", name: "Company B" },
    { id: "3", name: "Company C" },
  ];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="companyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="midName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter middle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Sex</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </FormControl>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="promoter">Promoter</SelectItem>
                <SelectItem value="superuser">Superuser</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="alexandria">Alexandria</SelectItem>
                <SelectItem value="cairo">Cairo</SelectItem>
              </SelectContent>
            </Select>
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
